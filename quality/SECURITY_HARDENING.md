# Security hardening

Human-operated and CI practices for `cesargomez.dev`. Complements CSP (`scripts/lib/csp.mjs`), Netlify headers, and form handling.

## GitHub Actions

- **SHA-pin third-party actions** where practical (`actions/checkout@<full-sha>` with a version comment). Reduces supply-chain drift from floating `@v5` tags.
- **Least privilege**: workflow-level `permissions: contents: read`; grant `pages: write` and `id-token: write` only on jobs that deploy (see `.github/workflows/deploy.yml`).
- **Secrets**: `NETLIFY_AUTH_TOKEN` scoped to the site; rotate on schedule or after any leak suspicion.

## Contact form (Netlify Forms)

- **Honeypot** (`bot-field`) — already wired in `ContactSection.vue`.
- **Max length** — HTML `maxlength` + client validation in `useContactForm.ts` (name 100, email 254, subject 200, message 5000).
- **Netlify spam filter** — enable in Netlify UI (Forms → spam filtering). Review false positives in the dashboard.
- **CAPTCHA** — add only if abuse appears; honeypot + maxlength + Netlify filter are the default stack.

## Netlify deploy token

- Store `NETLIFY_AUTH_TOKEN` in GitHub Actions secrets only; never commit.
- Rotate periodically and after collaborator offboarding.
- Prefer site-scoped tokens over personal tokens when Netlify allows.

## DNS / registrar (Namecheap)

- **MFA** on Namecheap account (and email recovery).
- Lock domain transfer; verify apex + `www` DNS point to Netlify as intended.
- Review auto-renew and billing alerts.

## Branch protection (GitHub)

- Require PR + passing CI before merge to `main`.
- Restrict who can push to `main` / bypass rules.
- Enable secret scanning and Dependabot alerts where available.

## Content-Security-Policy

- Production CSP is emitted to `public/_headers` at generate time — do not hand-edit without updating `scripts/lib/csp.mjs` and tests.
