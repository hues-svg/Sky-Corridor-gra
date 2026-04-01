# PLAN: Sky Corridor (Lightweight Phaser 3 Arcade Shooter MVP)

## 1) Game concept summary
A lightweight browser-based, top-down arcade shooter where the player pilots a fighter plane across the full visible screen while the battlefield scrolls downward continuously. Side terrain on the left and right frames the action and hosts hostile turrets. Enemy aircraft arrive in waves from above, creating layered pressure with turret fire and air threats.

## 2) Player fantasy and intended feel
- **Fantasy:** "I am a skilled ace pilot threading through hostile skies and defenses."
- **Feel targets:** immediate controls, readable chaos, satisfying hit feedback, punchy shooting, and continuous forward momentum.

## 3) Player goal
Survive as long as possible, destroy enemy aircraft and turrets, and earn a high score while avoiding incoming fire.

## 4) Core gameplay loop
1. Move freely across screen to evade threats.
2. Fire continuously/tap-fire at enemy waves and side turrets.
3. Read incoming bullet patterns from edges + top.
4. Destroy threats to score points and reduce pressure.
5. Survive escalating intensity until health reaches zero.
6. Restart and improve score.

## 5) Control scheme
- **Desktop:** Arrow keys or WASD for movement, Space to fire.
- **Mobile:** Left thumb virtual stick area (drag for movement direction), right-side touch-and-hold/tap to fire.
- Fallback MVP simplification: pointer drag movement + auto-fire on mobile if needed for responsiveness.

## 6) Camera / scrolling behavior
- Fixed camera (single-screen arcade view).
- World illusion via constant downward scrolling backgrounds/terrain details.
- Entities (turrets/enemies) spawn from top and move down relative to screen.

## 7) World layout
- Full-screen playable area for player movement.
- Left and right terrain bands occupy side regions and visually frame central combat zone.
- Central lane is open but not restrictive; player may enter near edges as needed.

## 8) Side terrain design
- Procedural geometric strips using repeating patterns, panel seams, warning lights, and subtle parallax.
- Slight variation in brightness/pattern speed to avoid flat visuals.
- Terrain scrolls downward continuously with the world.

## 9) Turret placement and behavior
- Turrets mounted on both side terrains.
- Spawn intervals with alternating left/right placement and occasional paired spawns.
- Rotate to track player heading.
- Fire toward player with cooldown + brief muzzle flash.
- Turrets drift downward with terrain and are removed off-screen.

## 10) Enemy aircraft behavior
- Wave-based spawns from top/upper sides.
- Simple archetypes for MVP:
  - **Strafers:** move downward with slight horizontal sine drift.
  - **Divers:** enter then angle toward player for short pressure burst.
- Enemies shoot at timed intervals and can be destroyed.

## 11) Projectile behavior
- Distinct projectile classes:
  - Player bullets: fast, bright, upward.
  - Enemy bullets: slightly slower, high contrast color.
- Small glow/trail impression via layered circles/sprites.
- Lifetime culling off-screen for performance.

## 12) Collision model
- Arcade Physics AABB/circle-style overlap checks.
- Collisions:
  - Player bullet vs enemy/turret
  - Enemy bullet vs player
  - Enemy body vs player (contact damage)
- Keep hitboxes forgiving but fair; visuals larger than hitbox where appropriate.

## 13) Damage, health, and fail state
- Player starts with fixed HP (e.g., 5).
- Enemies/turrets have low-to-mid HP values.
- On hit: flash + knockback impulse (small) + sound placeholder.
- Game over when HP <= 0, with final score shown and restart prompt.

## 14) Score system
- Points by threat type (enemy > turret > survival tick optional).
- HUD shows live score.
- Optional best score stored in localStorage.

## 15) Progression and difficulty scaling
- Intensity ramps over time via:
  - higher enemy spawn frequency,
  - faster enemy bullets,
  - more turret overlap windows,
  - occasional mixed waves.
- Keep first 20s welcoming, 20–40s medium, 40–60s high tension.

## 16) Pacing for first 60 seconds
- **0–10s:** onboarding, sparse enemies, single turret shots.
- **10–20s:** regular waves, occasional dual-side turret pressure.
- **20–35s:** enemy firing increases; crossfire moments start.
- **35–50s:** mixed wave archetypes with tighter dodge windows.
- **50–60s:** sustained pressure peak for MVP climax.

## 17) Visual direction
- Neon-arcade military hybrid palette:
  - player cyan/white,
  - enemy orange/red,
  - enemy bullets magenta/red,
  - player bullets lime/cyan,
  - terrain slate/steel with hazard accents.
- Strong contrast and silhouette readability prioritized.

## 18) Procedural placeholder art direction
- Build all visuals with Phaser Graphics-generated textures and primitive shapes.
- Add polish via:
  - pseudo-shadows,
  - glow layers,
  - hit flashes,
  - muzzle flashes,
  - particle explosions,
  - subtle scale tweens,
  - engine trail particles.
- Ensure all entities are cleanly named and isolated so imported art can replace texture keys later.

## 19) UI requirements
- Start screen with title, controls, and tap/click to begin.
- In-game HUD: score, HP, optional best score.
- Game over screen with final score and restart CTA.
- UI should be legible on mobile portrait/landscape and desktop.

## 20) Audio placeholders
- MVP uses optional generated/placeholder beep-like SFX hooks.
- If audio files are omitted, keep a minimal `AudioManager` stub for future drop-in.

## 21) MVP scope (must-have)
- Phaser-based single-level endless session.
- Free movement across full screen.
- Continuous downward scrolling battlefield.
- Side terrain + rotating firing turrets.
- Enemy waves.
- Player and enemy bullets.
- Collision, HP, score.
- Start screen, game over screen, restart flow.
- Procedural polished placeholder visuals.

## 22) Post-MVP upgrade ideas
- Boss waves and mini-bosses.
- Power-ups (spread shot, shield, speed burst).
- Distinct enemy factions/behaviors.
- Combo multipliers and rank medals.
- True sprite/audio asset pipeline.
- Touch control refinement (dual-stick overlay).

## 23) Technical stack
- Plain HTML + CSS + JavaScript (ES modules).
- Phaser 3 via CDN.
- No backend, no database, no auth.
- No build step required for MVP.

## 24) Lightweight/mobile-editable file structure proposal
- `index.html` - entry point
- `styles.css` - basic page shell and canvas hosting
- `src/config.js` - tuning constants
- `src/main.js` - Phaser setup
- `src/scenes/BootScene.js` - procedural textures + setup
- `src/scenes/StartScene.js`
- `src/scenes/GameScene.js`
- `src/scenes/GameOverScene.js`
- `src/entities/*` - optional lightweight classes/helpers for player/enemy/turret behavior
- `.logs/YYYY-MM-DD-*.md` - major implementation decisions/progress notes
- `README.md` - run instructions and structure

## 25) Milestone order
1. Draft PLAN.md (this file).
2. Draft AGENTS.md with guardrails for future runs.
3. Scaffold lightweight Phaser project + scenes.
4. Implement core player movement/shooting + scrolling terrain.
5. Add side turrets with aiming/firing.
6. Add enemy wave spawner + enemy bullets.
7. Add collisions, HP, score, game over/restart.
8. Add polish effects (flashes, particles, shake, engine trail, tweens).
9. Add README and logs; perform playability checks.
