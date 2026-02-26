# mrejinet-site

Static website for [mrejinet.co.uk](https://mrejinet.co.uk), built with [Hugo](https://gohugo.io/) and deployed via [Cloudflare Pages](https://pages.cloudflare.com/).

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

Pushes to `main` trigger automatic deployment via Cloudflare Pages Git integration.
PR branches get preview URLs at `<hash>.mrejinet-site.pages.dev`.

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
