import { CONFIG, GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.score = 0;
    this.hp = CONFIG.player.hp;
    this.lastFiredAt = 0;
    this.isGameOver = false;

    this.setupBackground();
    this.setupPlayer();
    this.setupGroups();
    this.setupCollisions();
    this.setupInput();
    this.setupHud();
    this.setupSpawners();
    this.setupEffects();
  }

  setupBackground() {
    this.starfield = this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'starfield');

    const tW = CONFIG.world.terrainWidth;
    this.leftTerrain = this.add.tileSprite(tW / 2, GAME_HEIGHT / 2, tW, GAME_HEIGHT, 'terrain').setTint(0x8db4d6);
    this.rightTerrain = this.add.tileSprite(GAME_WIDTH - tW / 2, GAME_HEIGHT / 2, tW, GAME_HEIGHT, 'terrain').setTint(0x789dc2);

    this.add.rectangle(tW + 6, GAME_HEIGHT / 2, 14, GAME_HEIGHT, 0x000000, 0.28);
    this.add.rectangle(GAME_WIDTH - tW - 6, GAME_HEIGHT / 2, 14, GAME_HEIGHT, 0x000000, 0.28);
  }

  setupPlayer() {
    this.player = this.physics.add.image(GAME_WIDTH / 2, GAME_HEIGHT - 120, 'playerShip');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(6);
    this.player.setCircle(10, 4, 8);

    this.engineTrail = this.add.particles(0, 0, 'particle', {
      lifespan: 380,
      speed: { min: 35, max: 90 },
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: [0x66fff7, 0xa9e2ff, 0x79d2ff],
      frequency: 45,
      follow: this.player,
      followOffset: { x: 0, y: 16 },
    }).setDepth(4);
  }

  setupGroups() {
    this.playerBullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.turrets = this.physics.add.group();
  }

  setupCollisions() {
    this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
      if (this.isGameOver) return;
      if (!bullet?.active || !enemy?.active || enemy.isDying) return;
      bullet.destroy();
      enemy.hp -= 1;
      this.hitFlash(enemy, 0xffccaa);
      if (enemy.hp <= 0) {
        enemy.isDying = true;
        this.destroyTarget(enemy, 120, CONFIG.fx.impactParticles);
      }
    });

    this.physics.add.overlap(this.playerBullets, this.turrets, (bullet, turret) => {
      if (this.isGameOver) return;
      bullet.destroy();
      turret.hp -= 1;
      this.hitFlash(turret, 0xffd39b);
      if (turret.hp <= 0) this.destroyTarget(turret, 170, CONFIG.fx.bigImpactParticles);
    });

    this.physics.add.overlap(this.enemyBullets, this.player, (bullet) => {
      if (this.isGameOver) return;
      bullet.destroy();
      this.damagePlayer(1);
    });

    this.physics.add.overlap(this.enemies, this.player, (enemy) => {
      if (this.isGameOver) return;
      enemy.destroy();
      this.damagePlayer(1);
      this.explode(enemy.x, enemy.y, 0xff9d73, 20, 0.0042);
    });
  }

  setupInput() {
    this.keys = this.input.keyboard.addKeys({
      up: 'W',
      down: 'S',
      left: 'A',
      right: 'D',
      up2: 'UP',
      down2: 'DOWN',
      left2: 'LEFT',
      right2: 'RIGHT',
      fire: 'SPACE',
    });

    this.touchPointer = null;
    this.touchTarget = new Phaser.Math.Vector2(this.player.x, this.player.y);

    this.input.on('pointerdown', (pointer) => {
      if (this.isGameOver) return;
      this.touchPointer = pointer;
      this.touchTarget.set(pointer.x, pointer.y);
    });

    this.input.on('pointermove', (pointer) => {
      if (this.isGameOver) return;
      if (this.touchPointer?.id !== pointer.id) return;
      this.touchTarget.set(pointer.x, pointer.y);
    });

    this.input.on('pointerup', (pointer) => {
      if (this.touchPointer?.id === pointer.id) this.touchPointer = null;
    });
  }

  setupHud() {
    this.scoreText = this.add.text(12, 10, 'SCORE 000000', {
      fontFamily: 'monospace',
      fontSize: '23px',
      color: '#d2f4ff',
      stroke: '#072033',
      strokeThickness: 4,
    }).setDepth(20);

    this.hpText = this.add.text(GAME_WIDTH - 12, 10, `HP ${this.hp}`, {
      fontFamily: 'monospace',
      fontSize: '23px',
      color: '#8dffb4',
      stroke: '#072033',
      strokeThickness: 4,
    }).setOrigin(1, 0).setDepth(20);
  }

  setupSpawners() {
    this.enemySpawnEvent = this.time.addEvent({
      delay: CONFIG.enemy.spawnRate,
      loop: true,
      callback: () => this.spawnWave(),
    });

    this.turretSpawnEvent = this.time.addEvent({
      delay: CONFIG.turret.spawnRate,
      loop: true,
      callback: () => this.spawnTurretRow(),
    });

    this.difficultyEvent = this.time.addEvent({
      delay: CONFIG.difficulty.rampEveryMs,
      loop: true,
      callback: () => this.rampDifficulty(),
    });
  }

  setupEffects() {
    this.impactEmitter = this.add.particles(0, 0, 'particle', {
      lifespan: 460,
      speed: { min: 50, max: 210 },
      quantity: 0,
      scale: { start: 1.2, end: 0 },
      alpha: { start: 0.98, end: 0 },
      emitting: false,
    }).setDepth(15);
  }

  update(_, delta) {
    if (this.isGameOver) return;

    this.starfield.tilePositionY -= CONFIG.scrollSpeed * 0.35 * (delta / 1000);
    this.leftTerrain.tilePositionY -= CONFIG.scrollSpeed * 0.94 * (delta / 1000);
    this.rightTerrain.tilePositionY -= CONFIG.scrollSpeed * 0.94 * (delta / 1000);

    this.updatePlayerMovement();
    this.updateFiring();
    this.updateActors(delta);

    this.cleanupOffscreen(this.playerBullets, -40, GAME_HEIGHT + 40);
    this.cleanupOffscreen(this.enemyBullets, -40, GAME_HEIGHT + 40);
    this.cleanupOffscreen(this.enemies, -60, GAME_HEIGHT + 60);
    this.cleanupOffscreen(this.turrets, -80, GAME_HEIGHT + 80);
  }

  updatePlayerMovement() {
    const usingTouch = Boolean(this.touchPointer?.isDown);

    if (usingTouch) {
      const targetX = Phaser.Math.Clamp(this.touchTarget.x, 16, GAME_WIDTH - 16);
      const targetY = Phaser.Math.Clamp(this.touchTarget.y, 18, GAME_HEIGHT - 24);

      const dx = targetX - this.player.x;
      const dy = targetY - this.player.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 2) {
        const moveStep = Math.min(distance, CONFIG.player.speed * (this.game.loop.delta / 1000) * 1.45);
        const ratio = moveStep / distance;
        this.player.x += dx * ratio;
        this.player.y += dy * ratio;
      } else {
        this.player.x = targetX;
        this.player.y = targetY;
      }
      this.player.body.setVelocity(0, 0);
    } else {
      let vx = 0;
      let vy = 0;
      if (this.keys.left.isDown || this.keys.left2.isDown) vx -= 1;
      if (this.keys.right.isDown || this.keys.right2.isDown) vx += 1;
      if (this.keys.up.isDown || this.keys.up2.isDown) vy -= 1;
      if (this.keys.down.isDown || this.keys.down2.isDown) vy += 1;
      const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(CONFIG.player.speed);
      this.player.setVelocity(v.x || 0, v.y || 0);
    }

    const tilt = Phaser.Math.Clamp((this.player.body?.velocity.x ?? 0) / CONFIG.player.speed, -1, 1);
    this.player.setRotation(tilt * 0.24);
  }

  updateFiring() {
    const wantsFire = this.keys.fire.isDown || this.touchPointer?.isDown;
    if (!wantsFire) return;

    const now = this.time.now;
    if (now - this.lastFiredAt < CONFIG.player.fireRate) return;
    this.lastFiredAt = now;

    const bullet = this.playerBullets.create(this.player.x, this.player.y - 20, 'playerBullet');
    bullet.body.setAllowGravity(false);
    bullet.setVelocity(0, -CONFIG.player.bulletSpeed);
    bullet.setDepth(8);

    this.tweens.add({ targets: this.player, duration: 45, yoyo: true, scaleX: 1.07, scaleY: 0.94 });
  }

  updateActors(delta) {
    this.enemies.children.each((enemy) => {
      if (!enemy.active) return;
      enemy.y += (CONFIG.scrollSpeed + enemy.driftSpeed) * (delta / 1000);
      enemy.x += Math.sin((this.time.now + enemy.wavePhase) * 0.0022) * enemy.waveAmp * (delta / 16.67);

      if (this.time.now > enemy.nextShotAt) {
        this.enemyFire(enemy.x, enemy.y + 10, this.player.x, this.player.y, CONFIG.enemy.bulletSpeed);
        enemy.nextShotAt = this.time.now + Phaser.Math.Between(CONFIG.enemy.fireRateMin, CONFIG.enemy.fireRateMax);
      }
    });

    this.turrets.children.each((turret) => {
      if (!turret.active) return;
      turret.y += CONFIG.scrollSpeed * (delta / 1000);
      const angle = Phaser.Math.Angle.Between(turret.x, turret.y, this.player.x, this.player.y);
      turret.rotation = angle + Math.PI / 2;

      if (this.time.now > turret.nextShotAt) {
        if (turret.variant === 'double') {
          this.enemyFire(turret.x - 5, turret.y, this.player.x, this.player.y, CONFIG.turret.bulletSpeed);
          this.enemyFire(turret.x + 5, turret.y, this.player.x, this.player.y, CONFIG.turret.bulletSpeed);
        } else {
          this.enemyFire(turret.x, turret.y, this.player.x, this.player.y, CONFIG.turret.bulletSpeed);
        }

        turret.nextShotAt = this.time.now + CONFIG.turret.fireRate;
        this.flashMuzzle(turret.x, turret.y, turret.variant === 'double' ? 1.4 : 1);
      }
    });
  }

  spawnWave() {
    const count = Phaser.Math.Between(2, 4);
    for (let i = 0; i < count; i += 1) {
      const x = Phaser.Math.Between(CONFIG.world.terrainWidth + 24, GAME_WIDTH - CONFIG.world.terrainWidth - 24);
      const enemy = this.enemies.create(x, -40 - i * 35, 'enemyShip');
      enemy.hp = CONFIG.enemy.hp;
      enemy.driftSpeed = Phaser.Math.Between(CONFIG.enemy.baseSpeed, CONFIG.enemy.baseSpeed + 70);
      enemy.waveAmp = Phaser.Math.FloatBetween(0.1, 0.95);
      enemy.wavePhase = Phaser.Math.Between(0, 1000);
      enemy.nextShotAt = this.time.now + Phaser.Math.Between(500, 1300);
      enemy.setDepth(6);
      enemy.setCircle(9, 2, 7);
    }
  }

  spawnTurretRow() {
    const spawnOne = (x, y) => {
      const turret = this.turrets.create(x, y, 'turret');
      turret.hp = CONFIG.turret.hp;
      turret.variant = Math.random() > 0.55 ? 'double' : 'single';
      turret.nextShotAt = this.time.now + Phaser.Math.Between(350, 900);
      turret.setScale(turret.variant === 'double' ? 1.08 : 1);
      turret.setTint(turret.variant === 'double' ? 0xffb777 : 0xffffff);
      turret.setDepth(7);
    };

    spawnOne(CONFIG.world.terrainWidth * 0.45, -24);
    if (Math.random() > 0.38) spawnOne(GAME_WIDTH - CONFIG.world.terrainWidth * 0.45, -90);
  }

  enemyFire(x, y, tx, ty, speed) {
    const bullet = this.enemyBullets.create(x, y, 'enemyBullet');
    const angle = Phaser.Math.Angle.Between(x, y, tx, ty);
    bullet.body.setAllowGravity(false);
    bullet.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    bullet.setDepth(9);
  }

  damagePlayer(amount) {
    if (this.isGameOver) return;

    this.hp -= amount;
    this.hpText.setText(`HP ${this.hp}`);
    this.hpText.setColor(this.hp <= 2 ? '#ff8f8f' : '#8dffb4');
    this.hitFlash(this.player, 0xffffff);
    this.cameras.main.shake(120, 0.0048);

    if (this.hp <= 0) {
      this.hp = 0;
      this.hpText.setText('HP 0');
      this.handleGameOver();
    }
  }

  handleGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.explode(this.player.x, this.player.y, 0xa7efff, 46, 0.0062);
    this.player.disableBody(true, true);
    this.touchPointer = null;

    this.enemySpawnEvent?.remove(false);
    this.turretSpawnEvent?.remove(false);
    this.difficultyEvent?.remove(false);

    this.enemyBullets.clear(true, true);
    this.playerBullets.clear(true, true);

    this.time.delayedCall(280, () => {
      const best = Math.max(this.score, Number(localStorage.getItem('sky-corridor-best') || 0));
      localStorage.setItem('sky-corridor-best', best);
      this.scene.start('gameover', { score: this.score, best });
    });
  }

  destroyTarget(target, points, particleCount) {
    if (!target?.active) return;
    this.explode(target.x, target.y, 0xff9f73, particleCount, 0.0044);
    this.additiveBlast(target.x, target.y, 0xffd2aa);
    target.destroy();
    this.score += points;
    this.scoreText.setText(`SCORE ${String(this.score).padStart(6, '0')}`);
  }

  explode(x, y, tint, amount, shake) {
    this.impactEmitter.setPosition(x, y);
    this.impactEmitter.setTint(tint);
    this.impactEmitter.explode(amount);
    this.cameras.main.shake(85, shake);
  }

  additiveBlast(x, y, color) {
    const ring = this.add.circle(x, y, 8, color, 0.9).setDepth(16).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: ring,
      scale: 3.2,
      alpha: 0,
      duration: 220,
      onComplete: () => ring.destroy(),
    });
  }

  hitFlash(target, tint) {
    if (!target?.active) return;
    target.setTintFill(tint);
    this.time.delayedCall(80, () => {
      if (target?.active) target.clearTint();
    });
  }

  flashMuzzle(x, y, scale = 1) {
    const flash = this.add.circle(x, y, 9, 0xffa56e, 0.84).setDepth(12).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({
      targets: flash,
      scaleX: 2.9 * scale,
      scaleY: 2.9 * scale,
      alpha: 0,
      duration: 120,
      onComplete: () => flash.destroy(),
    });
  }

  rampDifficulty() {
    if (this.isGameOver) return;
    CONFIG.enemy.spawnRate = Math.max(CONFIG.difficulty.spawnRateFloor, CONFIG.enemy.spawnRate - 90);
    CONFIG.turret.spawnRate = Math.max(CONFIG.difficulty.turretRateFloor, CONFIG.turret.spawnRate - 70);
    CONFIG.enemy.bulletSpeed = Math.min(CONFIG.difficulty.enemyBulletCap, CONFIG.enemy.bulletSpeed + 10);

    this.enemySpawnEvent.delay = CONFIG.enemy.spawnRate;
    this.turretSpawnEvent.delay = CONFIG.turret.spawnRate;
  }

  cleanupOffscreen(group, top, bottom) {
    group.children.each((obj) => {
      if (!obj.active) return;
      if (obj.y < top || obj.y > bottom || obj.x < -60 || obj.x > GAME_WIDTH + 60) obj.destroy();
    });
  }
}
