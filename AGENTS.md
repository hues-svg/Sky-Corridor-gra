# AGENTS.md - Working Rules for Sky Corridor

## Mission
Build and iterate on a lightweight, mobile-editable Phaser 3 top-down arcade shooter while preserving responsive gameplay, readability, and polished procedural visuals.

## Mandatory workflow
1. **Read `PLAN.md` before major changes.**
2. Keep MVP scope controlled; avoid feature bloat.
3. Build and test in small increments.
4. Log meaningful implementation decisions and milestones under `.logs/`.
5. Confirm core loop works end-to-end: start -> play -> game over -> restart.

## Design priorities
- Preserve arcade feel: quick response, readable threats, satisfying feedback.
- Player can move across the **entire visible screen**.
- Battlefield must continuously scroll downward.
- Left and right side terrain should frame the play area and host threats.
- Side turrets must visibly rotate/aim and fire at the player.
- Enemy waves should pressure central/upper screen space.

## Visual priorities (procedural first)
- Prefer procedural placeholder visuals first (Phaser shapes/graphics/textures).
- Prioritize readable silhouettes and color contrast:
  - player,
  - enemies,
  - player bullets,
  - enemy bullets,
  - terrain.
- Maintain clear hit feedback (flash, pop, shake, particles, fade/scale).
- Keep visuals intentionally styled (not flat prototype look).
- Document where real art assets can later replace generated textures.

## Technical constraints
- Keep stack lightweight: HTML/CSS/JS + Phaser 3.
- No backend/database/auth/build-heavy tooling for MVP.
- Favor simple modular structure and straightforward files.
- Keep project easy to inspect/edit from lightweight mobile editors (e.g., SPCK).

## Code and tuning guidelines
- Centralize gameplay tuning in constants/config values:
  - move speed,
  - fire rate,
  - health,
  - spawn rates,
  - scroll speed,
  - effect timings.
- Separate concerns where practical (scenes, enemies, turrets, projectiles, world scroll).
- Write concise comments only when useful; avoid noisy commentary.
- Avoid overengineering; choose the simplest solution that preserves feel and readability.

## Quality checklist for each meaningful update
- Game starts from start screen.
- Player can move freely and shoot.
- Side terrain scrolls and remains visually clear.
- Turrets spawn, track player, and fire.
- Enemy waves spawn and create pressure.
- Collisions and damage behave reasonably.
- Score updates correctly.
- Game over triggers and restart works cleanly.

## Logging requirements
- Add/update `.logs/` entries for major steps and decisions.
- Include date, summary, what changed, why, and next steps.

## Future asset swap guidance
- Keep texture keys and drawing utilities organized so future generated/imported art can replace placeholders with minimal logic changes.
