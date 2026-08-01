# Constitution — cesargomez.dev quality rules

1. **Honesty over hype**: Never claim AI Engineer / Principal / unsupported tenure. Prefer AI-Assisted Craft and verified metrics.
2. **Artifact is production**: Anything required at the CDN edge (CSP, cache, redirects) must live in the published `.output/public` tree for `--no-build` deploys.
3. **One entity**: `Person` `@id` is unique and stable; pages reference it rather than rewriting it.
4. **Locale discipline**: Canonical copy lives in `i18n/locales/`; hreflang uses `en-US`/`es-ES`.
5. **URL stability**: Do not rename `/ai-engineer/` or `/es/ingeniero-ia/` without an explicit product decision and 301 plan.
6. **CWV is a feature**: Decorative motion must degrade on mobile/reduced-motion; never steal LCP from the hero image.
7. **Accessible by default**: Dialogs trap focus; icon buttons have names; forms have labels; keyboard reaches every CTA.
8. **Proof over placeholders**: No Unsplash, `href="#"`, or invented KPIs in published case studies.
9. **Test what ships**: Prefer assertions on generated HTML/headers/sitemap over disconnected config objects.
10. **Measure then tune**: Keep CSS/JS strategies that win cold mobile lab+field budgets; discard cargo-cult optimizations.
