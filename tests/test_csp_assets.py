#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlparse
import re
import sys


REPO = Path(__file__).resolve().parents[1]
ENERGY_LAYOUT = REPO / "layouts" / "energy" / "list.html"
ENERGY_JS = REPO / "static" / "js" / "energy-dashboard.js"
HEADERS = REPO / "static" / "_headers"

EXPECTED_VENDOR_SCRIPTS = [
    "/vendor/papaparse/5.5.3/papaparse.min.js",
    "/vendor/chart.js/4.5.1/chart.umd.min.js",
    "/vendor/chartjs-adapter-date-fns/3.0.0/chartjs-adapter-date-fns.bundle.min.js",
    "/js/energy-dashboard.js",
]

DISALLOWED_SOURCE_PATTERNS = [
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "@import url(",
]

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


def fail(message):
    print(f"FAIL: {message}", file=sys.stderr)
    sys.exit(1)


def read(path):
    return path.read_text(encoding="utf-8")


def parse_script_sources(html):
    return re.findall(r"<script\s+[^>]*src=\"([^\"]+)\"", html)


def parse_csp(headers):
    match = re.search(r"^\s*Content-Security-Policy:\s*(.+)$", headers, re.MULTILINE)
    if not match:
        fail("static/_headers is missing Content-Security-Policy")

    directives = {}
    for directive in match.group(1).split(";"):
        parts = directive.strip().split()
        if parts:
            directives[parts[0]] = parts[1:]
    return directives


def assert_no_disallowed_sources():
    for path in [
        REPO / "assets",
        REPO / "layouts",
        REPO / "static" / "js",
        HEADERS,
    ]:
        files = [path] if path.is_file() else path.rglob("*")
        for file_path in files:
            if not file_path.is_file():
                continue
            text = read(file_path)
            for pattern in DISALLOWED_SOURCE_PATTERNS:
                if pattern in text:
                    fail(f"{file_path.relative_to(REPO)} contains disallowed external source {pattern}")


def assert_energy_scripts_are_local():
    sources = parse_script_sources(read(ENERGY_LAYOUT))
    if sources != EXPECTED_VENDOR_SCRIPTS:
        fail(f"energy script sources differ: {sources}")

    for src in sources:
        parsed = urlparse(src)
        if parsed.scheme or parsed.netloc:
            fail(f"energy script source is not local: {src}")
        if not (REPO / "static" / src.lstrip("/")).exists():
            fail(f"energy script source is missing from static/: {src}")


def assert_csp_is_narrow():
    directives = parse_csp(read(HEADERS))

    for directive, expected_values in REQUIRED_CSP_DIRECTIVES.items():
        actual = directives.get(directive)
        if actual != expected_values:
            fail(f"CSP {directive} is {actual}, expected {expected_values}")

    script_src = directives["script-src"]
    if any(value.startswith("https://") for value in script_src):
        fail(f"CSP script-src allows external origins: {script_src}")

    connect_src = directives["connect-src"]
    if "https://docs.google.com" not in connect_src:
        fail("CSP connect-src does not allow the Google Sheets CSV export origin")
    if "https://*.sheets.googleusercontent.com" not in connect_src:
        fail("CSP connect-src does not allow the Google Sheets CSV redirect host family")


def assert_dashboard_fetch_origin_matches_csp():
    dashboard_js = read(ENERGY_JS)
    if "https://docs.google.com/spreadsheets/" not in dashboard_js:
        fail("energy dashboard CSV URL no longer uses the expected Google Sheets export origin")


def main():
    assert_no_disallowed_sources()
    assert_energy_scripts_are_local()
    assert_csp_is_narrow()
    assert_dashboard_fetch_origin_matches_csp()
    print("PASS: energy dashboard assets are self-hosted and CSP is narrow")


if __name__ == "__main__":
    main()
