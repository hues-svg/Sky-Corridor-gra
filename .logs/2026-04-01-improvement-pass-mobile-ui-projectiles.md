# 2026-04-01 - Focused improvement pass (mobile + UI + bullet feel)

## Why
The first MVP pass needed better one-finger mobile controls, cleaner fullscreen presentation, simpler start UI, and stronger moment-to-moment impact feedback.

## Changes made
- Reworked mobile controls to direct touch-follow:
  - active touch sets a target point,
  - ship smoothly follows finger position,
  - ship auto-fires while touching.
- Kept desktop keyboard + space controls intact.
- Simplified projectile behavior expectations by ensuring enemy/turret bullets are fired with a one-time angle vector and then travel straight with fixed velocity.
- Updated layout to fullscreen gameplay presentation:
  - removed top header/title shell,
  - canvas now fills viewport.
- Simplified start screen to a clean layout with a single large PLAY button and reserved center framing for future background art.
- Added first-pass visual feel improvements:
  - stronger explosion particle counts,
  - additive blast ring on destruction,
  - stronger camera shake timings,
  - turret variety via simple single/double-barrel variants.

## Notes
- Kept code lightweight and centralized tuning in `src/config.js`.
- No backend/build tooling added.
