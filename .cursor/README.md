# Cursor AI configuration

Adapted from LingoQuesto `frontend-lq` for this portfolio repo.

## Layout

```
.cursor/
├── rules/     # Project rules — auto-injected in Agent chat
├── agents/    # Subagents — invoke with @name in Agent chat
└── README.md
```

## Agents

| Agent                                | Use for                                       |
| ------------------------------------ | --------------------------------------------- |
| `@nuxt-expert`                       | Nuxt 4, Nitro, routing, SSR/SSG, `useFetch`   |
| `@vuejs-expert`                      | Vue 3 Composition API, components, reactivity |
| `@gem-designer`                      | UI/UX, layout, visual design                  |
| `@gem-debugger`                      | Debugging failures and regressions            |
| `@gem-critic`                        | Code review, quality feedback                 |
| `@gem-code-simplifier`               | Refactoring and simplification                |
| `@gem-browser-tester`                | Browser-based verification                    |
| `@gem-documentation-writer`          | Docs and README updates                       |
| `@frontend-performance-investigator` | Performance, bundle size, Web Vitals          |
| `@implementation-plan`               | Multi-step feature planning                   |
| `@create-pr`                         | Commit, push, open PR                         |
| `@resume-pr`                         | Continue work on an existing PR               |

## Rules

| Rule                        | Scope                                        |
| --------------------------- | -------------------------------------------- |
| `portfolio-core.mdc`        | Always — stack, paths, i18n, deploy          |
| `ai-governance.mdc`         | Always — which agent to use                  |
| `ai-memories.mdc`           | Personal memories from `~/.cursor/memories/` |
| `no-cursor-attribution.mdc` | No "Made with Cursor" in commits/docs        |

## Not included (LingoQuesto-specific)

- `quality-playbook` orchestration
- `lingoquesto-core` monorepo rules
- Backend agents (`sdd-gap-check`, `service-responsibility-check`)

## Troubleshooting

- **Agent not found** → open a new Agent chat after adding files
- **Stale context** → new chat or `@portfolio-core` reminder
- **Sync from LingoQuesto** → copy from `LingoQuesto/frontend-lq/.cursor/agents/` and re-adapt rules
