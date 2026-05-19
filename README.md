# Simple Electron

Minimal Electron + Svelte + Vite + TypeScript starter.

## Stack

- **pnpm** — package manager
- **electron-vite** + **vite** — dev server / bundler for main, preload, renderer
- **svelte 5** — UI
- **typescript** — typing
- **eslint** + **prettier** — linting / formatting
- **electron-builder** — packaging

## Scripts

```sh
pnpm install
pnpm dev          # start in dev mode with HMR
pnpm build        # type-check + bundle main/preload/renderer
pnpm start        # preview the built app
pnpm package      # build an unpacked app (electron-builder --dir)
pnpm dist         # build distributable installers
pnpm lint         # eslint
pnpm format       # prettier --write
pnpm typecheck    # svelte-check + tsc on main
```

## Layout

```
src/
  main/       Electron main process
  preload/    contextBridge exposed API
  renderer/   Svelte app
```
