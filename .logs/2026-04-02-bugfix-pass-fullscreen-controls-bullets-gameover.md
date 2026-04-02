# 2026-04-02 - Strict bugfix pass (fullscreen, touch control, bullet path, game over)

## Scope
This pass only fixes reported behavior issues; no architecture redesign.

## Fixes completed
1. **True fullscreen mobile presentation**
   - `html`, `body`, and `#game-root` now use full viewport sizing (`100vw` + `100dvh`).
   - No external page framing or top title/header content above gameplay.

2. **Mobile controls replaced with direct touch-follow + auto-fire**
   - Active touch state is stored via `pointerdown/pointermove/pointerup`.
   - Ship follows touch target directly and responsively.
   - Auto-fire runs only while touch is held and stops on release.

3. **Enemy/turret bullets fixed to straight trajectories**
   - Bullet direction is computed once at fire time from shooter->player angle.
   - Velocity is set once and bullets continue straight; no in-flight correction logic.

4. **Player death / game over soft-lock fix**
   - Added `isGameOver` guard to prevent repeated death triggers and post-death damage.
   - On death: disable player body, remove spawn/difficulty timers, clear bullets, and transition reliably to `GameOverScene`.
   - Added explicit REPLAY button in Game Over scene.

## Verification notes
- Code path now prevents update-loop access to destroyed player after death.
- Restart flow is explicit via REPLAY button and Enter key.
