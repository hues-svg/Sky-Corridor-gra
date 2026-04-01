# Sky Corridor

Lightweight browser-based Phaser 3 top-down arcade shooter MVP.

## Run
Because this project is static files, any lightweight local server works:

```bash
python3 -m http.server 8080
```

Open: `http://localhost:8080`

## Controls
- Move: `WASD` or Arrow keys (or drag/touch)
- Fire: `Space` (or touch on right side)

## Stack
- HTML
- CSS
- JavaScript (ES modules)
- Phaser 3 via CDN

## Structure
- `PLAN.md` - gameplay and implementation plan
- `AGENTS.md` - guardrails for future Codex runs
- `index.html`, `styles.css` - host shell and presentation
- `src/config.js` - gameplay constants
- `src/scenes/*` - boot/start/game/game-over scenes
- `.logs/*` - implementation notes and major decisions

## Asset swap notes
The MVP uses generated textures (`playerShip`, `enemyShip`, `turret`, bullets, terrain) in `BootScene`. Replace these texture keys with imported assets later while keeping gameplay logic mostly unchanged.
