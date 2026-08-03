# mrejinet-site

Static website for [mrejinet.co.uk](https://mrejinet.co.uk), built with [Hugo](https://gohugo.io/) and served by the `mrejinet-site` Cloudflare Worker assets deployment.

## Local development

```bash
hugo server --buildDrafts
```

## Build

```bash
hugo --minify
```

Output is written to `public/`.

## Deployment

The repository is admitted to the shared development-workspace catalogue.
Create work with `pidns-dev-workspace create --project mrejinet-site <name>` and
publish it with `pidns-dev-workspace finish <name> --apply --release
--description "..."`. The typed adapter waits for the official Cloudflare check
at the exact Git commit, proves the resulting Worker version is serving 100% of
traffic, and completes the production Access/DNS/content audit.

The former `pidns-promote release --mrejinet-site`, direct `git push`, and
manual `wrangler deploy` paths remain retired.

The public apex and `www` records are proxied CNAMEs to the `mrejinet-site` Worker. The direct Workers.dev route is disabled in `wrangler.toml` with `workers_dev = false` so the Worker cannot bypass the Cloudflare Access gate on the custom hostnames.

## Content

Content pages live in `content/` as Markdown with YAML front matter. Create new pages:

```bash
hugo new content/posts/my-article.md
```

## Structure

```
content/          # Markdown pages (AI writes here)
layouts/          # Hugo HTML templates
static/           # Static assets, security headers, redirects
archetypes/       # Content templates
.github/workflows # CI pipeline
```
