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

Website development and publication are temporarily unavailable during the
Phase 5 break-before-make cutover. The former `pidns-promote release
--mrejinet-site`, direct `git push`, and manual `wrangler deploy` paths are no
longer accepted. Work resumes only after this repository is admitted to the
shared `pidns-dev-workspace` catalogue and its typed GitOps adapter becomes the
sole publication authority.

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
