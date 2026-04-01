import { CONFIG, GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.timeElapsed = 0;
    this.score = 0;
    this.hp = CONFIG.player.hp;
    this.levelFactor = 1;
    this.lastFiredAt = 0;

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

    this.leftShadow = this.add.rectangle(tW + 6, GAME_HEIGHT / 2, 14, GAME_HEIGHT, 0x000000, 0.25);
    this.rightShadow = this.add.rectangle(GAME_WIDTH - tW - 6, GAME_HEIGHT / 2, 14, GAME_HEIGHT, 0x000000, 0.25);
  }

  setupPlayer() {
    this.player = this.physics.add.image(GAME_WIDTH / 2, GAME_HEIGHT - 120, 'playerShip');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(5);
    this.player.setCircle(10, 4, 8);

    this.engineTrail = this.add.particles(0, 0, 'particle', {
      lifespan: 350,
      speed: { min: 25, max: 70 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.6, end: 0 },
      tint: [0x66fff7, 0xa9e2ff],
      frequency: 60,
      follow: this.player,
      followOffset: { x: 0, y: 16 },
    });
    this.engineTrail.setDepth(3);
  }

  setupGroups() {
    this.playerBullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.turrets = this.physics.add.group();
  }

  setupCollisions() {
    this.physics.add.overlap(this.playerBullets, this.enemies, (bullet, enemy) => {
      bullet.destroy();
      enemy.hp -= 1;
      this.hitFlash(enemy, 0xffccaa);
      if (enemy.hp <= 0) {
        this.destroyTarget(enemy, 120);
      }
    });

    this.physics.add.overlap(this.playerBullets, this.turrets, (bullet, turret) => {
      bullet.destroy();
      turret.hp -= 1;
      this.hitFlash(turret, 0xffc08f);
      if (turret.hp <= 0) {
        this.destroyTarget(turret, 160);
      }
    });

    this.physics.add.overlap(this.enemyBullets, this.player, (bullet) => {
      bullet.destroy();
      this.damagePlayer(1);
    });

    this.physics.add.overlap(this.enemies, this.player, (enemy) => {
      enemy.destroy();
      this.damagePlayer(1);
      this.explode(enemy.x, enemy.y, 0xff9d73, 14);
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

    this.pointerMove = null;
    this.isTouchFiring = false;

    this.input.on('pointerdown', (pointer) => {
      if (pointer.x > GAME_WIDTH * 0.55) {
        this.isTouchFiring = true;
      } else {
        this.pointerMove = pointer;
      }
    });

    this.input.on('pointerup', () => {
      this.pointerMove = null;
      this.isTouchFiring = false;
    });
  }

  setupHud() {
    this.scoreText = this.add.text(12, 8, 'SCORE 000000', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#d2f4ff',
      stroke: '#072033',
      strokeThickness: 4,
    }).setDepth(20);

    this.hpText = this.add.text(GAME_WIDTH - 12, 8, `HP ${this.hp}`, {
      fontFamily: 'monospace',
      fontSize: '24px',
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

    this.time.addEvent({
      delay: CONFIG.difficulty.rampEveryMs,
      loop: true,
      callback: () => this.rampDifficulty(),
    });
  }

  setupEffects() {
    this.impactEmitter = this.add.particles(0, 0, 'particle', {
      lifespan: 380,
      speed: { min: 40, max: 180 },
      quantity: 0,
      scale: { start: 0.9, end: 0 },
      alpha: { start: 0.95, end: 0 },
      emitting: false,
    });
    this.impactEmitter.setDepth(15);
  }

  update(_, delta) {
    this.timeElapsed += delta;

    this.starfield.tilePositionY -= CONFIG.scrollSpeed * 0.3 * (delta / 1000);
    this.leftTerrain.tilePositionY -= CONFIG.scrollSpeed * 0.9 * (delta / 1000);
    this.rightTerrain.tilePositionY -= CONFIG.scrollSpeed * 0.9 * (delta / 1000);

    this.updatePlayerMovement();
    this.updateFiring();
    this.updateActors(delta);

    this.cleanupOffscreen(this.playerBullets, -40, GAME_HEIGHT + 40);
    this.cleanupOffscreen(this.enemyBullets, -40, GAME_HEIGHT + 40);
    this.cleanupOffscreen(this.enemies, -60, GAME_HEIGHT + 60);
    this.cleanupOffscreen(this.turrets, -80, GAME_HEIGHT + 80);
  }

  updatePlayerMovement() {
    let vx = 0;
    let vy = 0;

    if (this.keys.left.isDown || this.keys.left2.isDown) vx -= 1;
    if (this.keys.right.isDown || this.keys.right2.isDown) vx += 1;
    if (this.keys.up.isDown || this.keys.up2.isDown) vy -= 1;
    if (this.keys.down.isDown || this.keys.down2.isDown) vy += 1;

    if (this.pointerMove?.isDown) {
      const dx = this.pointerMove.x - this.player.x;
      const dy = this.pointerMove.y - this.player.y;
      vx += Phaser.Math.Clamp(dx / 80, -1, 1);
      vy += Phaser.Math.Clamp(dy / 80, -1, 1);
    }

    const v = new Phaser.Math.Vector2(vx, vy).normalize().scale(CONFIG.player.speed);
    this.player.setVelocity(v.x || 0, v.y || 0);

    const tilt = Phaser.Math.Clamp(this.player.body.velocity.x / CONFIG.player.speed, -1, 1);
    this.player.setRotation(tilt * 0.25);
  }

  updateFiring() {
    const wantsFire = this.keys.fire.isDown || this.isTouchFiring;
    if (!wantsFire) return;
    const now = this.time.now;
    if (now - this.lastFiredAt < CONFIG.player.fireRate) return;

    this.lastFiredAt = now;
    const bullet = this.playerBullets.create(this.player.x, this.player.y - 20, 'playerBullet');
    bullet.setVelocityY(-CONFIG.player.bulletSpeed);
    bullet.setDepth(8);

    this.tweens.add({ targets: this.player, duration: 40, yoyo: true, scaleX: 1.04, scaleY: 0.96 });
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
        this.enemyFire(turret.x, turret.y, this.player.x, this.player.y, CONFIG.turret.bulletSpeed);
        turret.nextShotAt = this.time.now + CONFIG.turret.fireRate;
        this.flashMuzzle(turret.x, turret.y);
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
      enemy.waveAmp = Phaser.Math.Between(0, 0.45) * 2;
      enemy.wavePhase = Phaser.Math.Between(0, 1000);
      enemy.nextShotAt = this.time.now + Phaser.Math.Between(500, 1400);
      enemy.setDepth(6);
      enemy.setCircle(9, 2, 7);
    }
  }

  spawnTurretRow() {
    const y = -26;
    const left = this.turrets.create(CONFIG.world.terrainWidth * 0.45, y, 'turret');
    left.hp = CONFIG.turret.hp;
    left.nextShotAt = this.time.now + Phaser.Math.Between(350, 850);
    left.setDepth(7);

    if (Math.random() > 0.4) {
      const right = this.turrets.create(GAME_WIDTH - CONFIG.world.terrainWidth * 0.45, y - 70, 'turret');
      right.hp = CONFIG.turret.hp;
      right.nextShotAt = this.time.now + Phaser.Math.Between(550, 1100);
      right.setDepth(7);
    }
  }

  enemyFire(x, y, tx, ty, speed) {
    const bullet = this.enemyBullets.create(x, y, 'enemyBullet');
    const angle = Phaser.Math.Angle.Between(x, y, tx, ty);
    this.physics.velocityFromRotation(angle, speed, bullet.body.velocity);
    bullet.setDepth(9);
  }

  damagePlayer(amount) {
    this.hp -= amount;
    this.hpText.setText(`HP ${this.hp}`);
    this.hpText.setColor(this.hp <= 2 ? '#ff8f8f' : '#8dffb4');
    this.hitFlash(this.player, 0xffffff);
    this.cameras.main.shake(90, 0.004);

    if (this.hp <= 0) {
      this.explode(this.player.x, this.player.y, 0xa7efff, 28);
      this.player.destroy();
      this.endGame();
    }
  }

  destroyTarget(target, points) {
    this.explode(target.x, target.y, 0xff9f73, 18);
    target.destroy();
    this.score += points;
    this.scoreText.setText(`SCORE ${String(this.score).padStart(6, '0')}`);
  }

  explode(x, y, tint, amount) {
    this.impactEmitter.setPosition(x, y);
    this.impactEmitter.setTint(tint);
    this.impactEmitter.explode(amount);
    this.cameras.main.shake(70, 0.0026);
  }

  hitFlash(target, tint) {
    if (!target?.active) return;
    target.setTintFill(tint);
    this.time.delayedCall(70, () => target.clearTint());
  }

  flashMuzzle(x, y) {
    const flash = this.add.circle(x, y, 7, 0xffa56e, 0.7).setDepth(12);
    this.tweens.add({
      targets: flash,
      scaleX: 2.4,
      scaleY: 2.4,
      alpha: 0,
      duration: 120,
      onComplete: () => flash.destroy(),
    });
  }

  rampDifficulty() {
    this.levelFactor += 0.08;
    CONFIG.enemy.spawnRate = Math.max(CONFIG.difficulty.spawnRateFloor, CONFIG.enemy.spawnRate - 90);
    CONFIG.turret.spawnRate = Math.max(CONFIG.difficulty.turretRateFloor, CONFIG.turret.spawnRate - 70);
    CONFIG.enemy.bulletSpeed = Math.min(CONFIG.difficulty.enemyBulletCap, CONFIG.enemy.bulletSpeed + 10);

    this.enemySpawnEvent.delay = CONFIG.enemy.spawnRate;
    this.turretSpawnEvent.delay = CONFIG.turret.spawnRate;
  }

  cleanupOffscreen(group, top, bottom) {
    group.children.each((obj) => {
      if (!obj.active) return;
      if (obj.y < top || obj.y > bottom || obj.x < -60 || obj.x > GAME_WIDTH + 60) {
        obj.destroy();
      }
    });
  }

  endGame() {
    this.physics.pause();
    this.time.delayedCall(600, () => {
      const best = Math.max(this.score, Number(localStorage.getItem('sky-corridor-best') || 0));
      localStorage.setItem('sky-corridor-best', best);
      this.scene.start('gameover', { score: this.score, best });
    });
  }
}
