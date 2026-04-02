# 2026-04-02 - Enemy hit/destroy freeze fix

## Root cause
Enemy hit/destroy flow could re-enter on the same enemy during overlap frames, and `hitFlash` queued `clearTint()` on objects that may already be destroyed.

## Targeted fix
- Added guard checks in player-bullet vs enemy overlap:
  - skip if bullet/enemy inactive,
  - skip if enemy already marked `isDying`.
- Mark enemy `isDying = true` before running destroy flow.
- Added safe guard in `destroyTarget` to return if target is already inactive.
- Made delayed tint reset safe by checking `target?.active` before `clearTint()`.

## Result
Enemy hit/destroy callbacks are now idempotent and safe against destroyed-object callbacks, preventing freeze/stall when shooting enemies.
