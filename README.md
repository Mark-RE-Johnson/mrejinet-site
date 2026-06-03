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

Pushes to `main` are released through `pidns-promote release --mrejinet-site`.
The public apex and `www` records are DNS-only CNAMEs to `mrejinet-site.rpnzgydm6h.workers.dev`; Cloudflare Access still gates both custom hostnames.

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
