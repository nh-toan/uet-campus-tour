# Integration Status — Campus Map 3D

## Status

**INT-01 → INT-08: COMPLETE**

INT-08 was manually accepted after desktop and real-device mobile regression.

## Accepted baseline

- Integration branch: `integration/map3d`
- Baseline before this status-document commit: `49766c8` (`UI: add aerial campus background`)

## Final architecture

- The UET Navigator host UI and Campus Map 3D are directly integrated in one React application; no iframe is used.
- The Map feature is isolated at `frontend/src/features/campus-map/`.
- `CampusMapModule` is lazy-loaded only at `/ban-do` and mounts inside the host `#map-viewer`.
- The host uses React 19 and Vite 8.
- Map styling uses semantic, scoped CSS; Tailwind is not included.
- The host continues to own the backend and API/content contracts, including `/api/lien-chi` and `/api/clubs`.
- Map spatial state remains feature-local through `useCampusStore`; it does not own or import host content/backend data.

## Regression result

- Host UI regression: PASS.
- Map flow regression: PASS.
- Desktop manual regression: PASS.
- Real-device mobile regression: PASS.
- Machine checks: typecheck, production build, backend syntax, API proxy smoke test, and `git diff --check` passed.

## Known warning

- The lazy-loaded Map/Three chunk remains larger than 500 kB after minification. This is expected for the current Map Phase 1 scope and does not affect initial non-map route loading.

## Next step

Push `integration/map3d` for review and merge it into `main` only after merge preflight and explicit approval.
