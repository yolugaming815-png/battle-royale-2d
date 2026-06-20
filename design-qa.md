# Design QA

source visual truth path: `/Users/danielherbera/.codex/generated_images/019ee532-bbe5-7263-aeec-9648b8063081/ig_055cd7a22fb44f9e016a36984b93fc8191a2567aa07b064cea.png`
implementation screenshot path: `/tmp/battle-royale-game-desktop.png`
additional screenshot path: `/tmp/battle-royale-game-mobile.png`
viewport: 1440x1024 desktop, 390x844 mobile
state: active normal match after pressing Jouer then Mode normal

full-view comparison evidence: source and implementation both use a flat green .io island style, thick black outlines, compact top-left survival HUD, top-right leaderboard, bottom-center 4-slot hotbar, bottom-right minimap, readable circular player silhouettes, and simplified loot/obstacles.

focused region comparison evidence: focused checks were made on HUD clusters, hotbar, minimap, player silhouette, terrain grid, and leaderboard. The source contains a denser staged fight; the implementation was checked in a real random spawn state, so exact object positions are expected to differ.

findings:
- No P0/P1/P2 issues remaining.
- P3: The menu remains a larger centered panel than the active-game reference. It is acceptable for this pass because the requested direction targeted the in-game .io experience.
- P3: Hotbar item labels are intentionally tiny to preserve the playfield; future polish could replace labels with stronger generated/icon assets.

patches made since previous QA pass:
- Added `.io` leaderboard markup and live ranking.
- Added `IO_THEME` and simplified canvas palette.
- Reworked terrain, grid, roads, water, bridges, buildings, trees, rocks, crates, danger zone, loot, bullets, fighters, names, bars, and minimap toward the Surviv Lite visual target.
- Reworked CSS HUD/menu styling with flatter colors, thick outlines, compact HUD placement, mobile layout, and bottom-right minimap.
- Added `tests/io-visual-direction.test.js` as a visual-direction guard.

verification:
- `node --test tests/io-visual-direction.test.js` passed.
- `node --check game.js && node --check tests/io-visual-direction.test.js` passed.
- Local server responded at `http://127.0.0.1:4173/`.
- Playwright fallback launched a normal match, verified visible HUD, visible leaderboard, 4 hotbar slots, visible minimap, 1440x1024 canvas, and no console/page errors.

tooling notes:
- Browser plugin initialization was blocked by `codex/sandbox-state-meta: missing field sandboxPolicy`.
- Fallback screenshots were captured via cached Playwright CLI/runtime without adding dependencies to the repo.

final result: passed
