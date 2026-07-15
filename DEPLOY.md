# Deployment Guide

## Production: Netlify (`cesargomez.dev`)

### 1. Login and link the site

```bash
npx netlify login
npx netlify link --git-remote-url https://github.com/mrcego/me.git
# or: npx netlify init
```

### 2. Custom domain

Add `cesargomez.dev` in **Project configuration → Domain management**, then configure DNS at your registrar:

| Type    | Host  | Value                        |
| ------- | ----- | ---------------------------- |
| `A`     | `@`   | `75.2.60.5`                  |
| `CNAME` | `www` | `cesargomez-dev.netlify.app` |

Netlify provisions HTTPS automatically once DNS propagates (can take up to 24h).

Or open domain settings directly:

```bash
npx netlify open --admin
```

### 3. Deploy

```bash
pnpm install
npx netlify deploy --build --prod
```

Or connect the GitHub repo in the Netlify UI for automatic deploys on push.

### 4. Forms

After deploy, confirm `portfolio-contact` appears under **Forms** in the Netlify UI. Enable email notifications there.

The static skeleton lives at `public/netlify-forms.html` (Nuxt excludes `__*` files from output).

---

## Legacy redirect: GitHub Pages

`https://mrcego.github.io/me` now serves a static redirect to `https://cesargomez.dev`.

The workflow `.github/workflows/deploy.yml` publishes only `redirect/gh-pages/` (no Nuxt build).

---

## Local development

```bash
pnpm dev
# http://localhost:3000/
```

For local Netlify features (forms, headers):

```bash
npx netlify dev
```

---

## Commands

`pnpm generate` · `pnpm lint` · `pnpm typecheck` · `pnpm prepush:validate`
