# 2026-04-01 - MVP implementation

## Implemented
- Boot scene generates all procedural textures for ships, bullets, turrets, terrain, stars, and particles.
- Start, Game, and GameOver scenes implemented.
- Full-screen player movement with keyboard + pointer/touch support.
- Continuous downward world scrolling via tile sprites.
- Side terrain strips and mounted turrets that track/fire at player.
- Enemy wave spawning with drift and firing behavior.
- Collision handling, HP, score HUD, explosions, flashes, shake, and restart flow.
- README run/setup notes.

## Why this approach
- Keeps codebase easy to inspect/edit from phone-friendly editors.
- No heavy dependencies or backend requirements.
- Tuning values centralized in `src/config.js` for fast balancing.

## Next opportunities
- Add optional audio cues.
- Refine touch controls to dual-stick overlay.
- Add mini-boss and power-up variants.
