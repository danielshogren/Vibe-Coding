# Project Instructions

## Stack
- Next.js 15.5.12, React, TypeScript
- Dev server: `npm run dev` on localhost:3000
- LAN access: `http://192.168.50.156:3000` (requires firewall rule below)

## Theme System
Two themes: **Metropolis** (light) and **Bond** (dark), toggled via the settings gear icon.

- CSS custom properties (RGB triplets) defined in `app/globals.css` under `:root` (light) and `[data-theme="dark"]` (dark)
- `tailwind.config.ts` maps semantic tokens to those CSS variables
- ThemeProvider in `app/providers/ThemeProvider.tsx` — React context with `useTheme()` hook, persists to `localStorage("theme")`, sets `data-theme` attribute on `<html>`

### Semantic color tokens
`surface`, `ink`, `edge`, `primary`, `danger`, `accent`, `highlight`, `indicator`, `status-*` (backlog/progress/stuck/done), `priority-*` (low/medium/high/urgent), `approved`, `completed`

### Rule: Always use semantic tokens
Never hardcode Tailwind color classes (`gray-*`, `blue-*`, `red-*`, `amber-*`, `green-*`, etc.). Always use the semantic tokens defined in `tailwind.config.ts`.

### Adding a new color token
1. Define the CSS variable in `app/globals.css` — add to both `:root` and `[data-theme="dark"]`
2. Map it in `tailwind.config.ts` under `theme.extend.colors`

## Architecture Patterns
- **Portal for modals inside sticky header**: The sticky header uses `backdrop-blur-md` which creates a new CSS stacking context. Any modal rendered inside it must use `createPortal(modal, document.body)` to escape.

## Key Files
- `app/globals.css` — theme variables, animations
- `tailwind.config.ts` — semantic color token mappings
- `app/components/ProjectCalendarView.tsx` — main layout orchestrator
- `app/components/ProjectItemList.tsx` — project card list with approve/complete actions
- `app/components/SettingsButton.tsx` — settings modal (uses portal)
- `app/components/StatusBadge.tsx` — status/priority badge rendering

## Troubleshooting
- **Corrupted `.next` cache**: Delete the `.next` directory and restart the dev server.
- **LAN access blocked**: A Windows Firewall inbound rule is needed for TCP port 3000. Add it (elevated terminal):
  ```
  netsh advfirewall firewall add rule name="Next.js Dev Server" dir=in action=allow protocol=TCP localport=3000
  ```
  Remove it when no longer needed:
  ```
  netsh advfirewall firewall delete rule name="Next.js Dev Server"
  ```
