#!/usr/bin/env python3
"""Check relationships between actual Hugo output, local assets and its CSP.

This is an offline rendered-resource contract, not browser or deployed-header proof.
The dashboard's real fetch producer executes in Node with an inert Papa adapter.
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
import json
import os
import re
import subprocess
import tempfile
import tomllib

REPO = Path(__file__).resolve().parents[1]

REQUIRED_CSP_DIRECTIVES = {
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "script-src": ["'self'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:"],
    "font-src": ["'self'"],
    "connect-src": [
        "'self'",
        "https://docs.google.com",
        "https://*.sheets.googleusercontent.com",
    ],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def parse_csp(headers):
    policies = []
    route = None
    for line in headers.splitlines():
        if line and not line[0].isspace() and not line.startswith("#"):
            route = line.strip()
        match = re.match(r"\s+Content-Security-Policy:\s*(.+)$", line, re.I)
        if match:
            require(route == "/*", "CSP must govern the whole rendered site")
            policies.append(match.group(1))
    require(len(policies) == 1, "expected one global CSP header; duplicates/conflicts refused")
    directives = {}
    for clause in policies[0].split(";"):
        parts = clause.split()
        if not parts:
            continue
        name, values = parts[0].lower(), parts[1:]
        require(name not in directives, f"duplicate CSP directive: {name}")
        require(len(values) == len(set(values)), f"duplicate CSP value: {name}")
        directives[name] = set(values)
    require(directives == {name: set(values) for name, values in REQUIRED_CSP_DIRECTIVES.items()},
            "rendered CSP differs from the supported narrow policy")
    return directives


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.resources, self.scripts, self.styles = [], [], []
        self.in_style = self.in_script = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        require(len(values) == len(attrs), f"duplicate HTML attribute on {tag}")
        require(not any(name.startswith("on") for name in values), "inline event handler violates script policy")
        if tag == "base":
            raise AssertionError("rendered base URL overrides are unsupported")
        if tag == "script":
            src = values.get("src")
            if src:
                self.scripts.append((src, values))
                self.resources.append(("script-src", src))
            self.in_script = not src
        if tag == "style":
            self.in_style = True
        if "style" in values:
            self.styles.append(values["style"])
        if tag == "link":
            rel = values.get("rel", "").lower().split()
            if "stylesheet" in rel:
                self.resources.append(("style-src", values.get("href", "")))
            if "preload" in rel and values.get("as", "").lower() == "font":
                self.resources.append(("font-src", values.get("href", "")))

    def handle_endtag(self, tag):
        if tag == "style":
            self.in_style = False
        if tag == "script":
            self.in_script = False

    def handle_data(self, data):
        if self.in_style:
            self.styles.append(data)
        if self.in_script:
            require(not data.strip(), "inline script violates script policy")


# Tokenize resource-bearing CSS constructs, skipping comments and unrelated strings.
# Ambiguous/unclosed URL/import syntax is rejected instead of treated as no resource.
CSS_TOKEN = re.compile(r'''@font-face\b|[{}]|/\*.*?\*/|@import\s+(?:url\(\s*(?:"[^"]*"|'[^']*'|[^)]*)\s*\)|"[^"]*"|'[^']*')|\burl\(\s*(?:"[^"]*"|'[^']*'|[^)]*)\s*\)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*' '''.strip(), re.I | re.S)


def css_references(css):
    # Hugo minifies stylesheets; normalize CSS escapes before recognizing identifiers.
    css = re.sub(r"\\([0-9a-fA-F]{1,6})(?:\s)?|\\([^\r\n\f])",
                 lambda m: chr(int(m[1], 16)) if m[1] else m[2], css)
    refs, remainder, offset = [], [], 0
    blocks, font_pending = [], False
    for token in CSS_TOKEN.finditer(css):
        remainder.append(css[offset:token.start()])
        offset = token.end()
        text = token.group()
        if text.startswith("/*") or text[:1] in "\"'":
            continue
        if text.lower() == "@font-face":
            font_pending = True
            continue
        if text == "{":
            blocks.append(font_pending or bool(blocks and blocks[-1]))
            font_pending = False
            continue
        if text == "}":
            require(bool(blocks), "unbalanced CSS block")
            blocks.pop()
            continue
        imported = text.lower().startswith("@import")
        text = re.sub(r"^@import\s+", "", text, flags=re.I)
        if text.lower().startswith("url("):
            text = text[4:-1].strip()
        value = text.strip("\"'")
        require(bool(value), "empty CSS resource")
        refs.append(("style-src" if imported else "font-src" if blocks and blocks[-1] else "img-src", value))
    remainder.append(css[offset:])
    require(not blocks and not font_pending, "unbalanced CSS resource block")
    require(not re.search(r"@import|\burl\s*\(|(?:-webkit-)?image-set\s*\(", "".join(remainder), re.I),
            "unparsed or unsupported CSS resource syntax")
    return refs


def check_site(public, base_url):
    public = public.resolve()
    policy = parse_csp((public / "_headers").read_text())
    origin = urlparse(base_url)
    seen_css = set()

    def resource(directive, reference, parent_url):
        require(bool(reference), f"empty {directive} resource")
        resolved = urlparse(urljoin(parent_url, reference))
        same_origin = (resolved.scheme, resolved.netloc) == (origin.scheme, origin.netloc)
        if resolved.scheme == "data":
            require("data:" in policy[directive], f"data resource forbidden by {directive}")
            return None
        require(same_origin and "'self'" in policy[directive], f"nonlocal resource forbidden by {directive}")
        path = (public / unquote(resolved.path).lstrip("/")).resolve()
        require(path.is_relative_to(public) and path.is_file(), f"missing/locality-invalid {directive} asset: {resolved.path}")
        if directive == "style-src" and path not in seen_css:
            seen_css.add(path)
            for kind, value in css_references(path.read_text()):
                resource(kind, value, resolved.geturl())
        return path

    pages = list(public.rglob("*.html"))
    require(bool(pages), "Hugo output contains no HTML")
    energy = None
    for path in pages:
        page = Page()
        page.feed(path.read_text())
        address = urljoin(base_url, path.relative_to(public).as_posix())
        for kind, value in page.resources:
            resource(kind, value, address)
        for style in page.styles:
            for kind, value in css_references(style):
                resource(kind, value, address)
        if path.relative_to(public).as_posix() == "energy/index.html":
            energy = page
    require(energy is not None, "rendered energy page missing")
    roles = {
        "papa": "papaparse.min.js", "chart": "chart.umd.min.js",
        "adapter": "chartjs-adapter-date-fns.bundle.min.js", "dashboard": "energy-dashboard.js",
    }
    positions, paths = {}, {}
    for role, basename in roles.items():
        matches = [(i, src, attrs) for i, (src, attrs) in enumerate(energy.scripts)
                   if Path(urlparse(src).path).name == basename]
        require(len(matches) == 1, f"expected one rendered {role} script")
        index, src, attrs = matches[0]
        require(not {"async", "defer"} & attrs.keys() and attrs.get("type", "text/javascript") == "text/javascript",
                f"{role} must retain ordered classic script execution")
        positions[role] = index
        paths[role] = resource("script-src", src, urljoin(base_url, "energy/"))
    require(positions["chart"] < positions["adapter"], "Chart.js must precede its date adapter")
    require(all(positions[role] < positions["dashboard"] for role in ("papa", "chart", "adapter")),
            "dashboard must follow all dependencies")

    # Run the actual emitted producer. No DOM event callback or data callback executes;
    # the only allowed I/O adapter records origin metadata, never household CSV content.
    probe = r"""
const fs = require('fs'), vm = require('vm');
const origins = [];
const context = {document: {addEventListener() {}, getElementById() { return {style:{}}; }},
  Papa: {parse(url, options) { if (options.download !== true) throw Error('CSV producer stopped downloading'); origins.push(new URL(url).origin); }}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(process.argv[1], 'utf8'), context, {timeout: 1000});
vm.runInContext('fetchData()', context, {timeout: 1000});
process.stdout.write(JSON.stringify(origins));
"""
    result = subprocess.run(["node", "-e", probe, str(paths["dashboard"])], text=True,
                            capture_output=True, check=True, timeout=10)
    fetch_origins = json.loads(result.stdout)
    require(len(fetch_origins) == 1, "expected one actual CSV producer request")
    for value in fetch_origins:
        allowed = value in policy["connect-src"] or (value == f"{origin.scheme}://{origin.netloc}" and "'self'" in policy["connect-src"])
        require(allowed, "actual CSV producer origin is outside connect-src")


def main():
    base_url = tomllib.loads((REPO / "hugo.toml").read_text())["baseURL"]
    with tempfile.TemporaryDirectory(prefix="mrejinet-csp-render-") as raw:
        output = Path(raw) / "public"
        subprocess.run(["hugo", "--minify", "--destination", str(output), "--cacheDir", str(Path(raw) / "cache"),
                        "--noBuildLock"], cwd=REPO, env={**os.environ, "HUGO_BUILD_WRITESTATS": "false"},
                       check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        check_site(output, base_url)
    print("PASS: rendered local assets, dependency order and actual fetch origin match parsed CSP")


if __name__ == "__main__":
    main()
