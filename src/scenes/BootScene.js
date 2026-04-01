import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  create() {
    this.makeTextures();
    this.scene.start('start');
  }

  makeTextures() {
    this.makeShipTexture('playerShip', 26, 32, 0x5df2ff, 0xb6fbff, 0x05293a);
    this.makeShipTexture('enemyShip', 22, 28, 0xff8f4a, 0xffcf9c, 0x3a1405);
    this.makeBulletTexture('playerBullet', 0x98ffe8, 0xffffff, 4, 14);
    this.makeBulletTexture('enemyBullet', 0xff5f88, 0xffd0db, 5, 12);
    this.makeTurretTexture();
    this.makeTerrainTextures();
    this.makeParticleTexture();
  }

  makeShipTexture(key, w, h, colorMain, colorCore, shadowColor) {
    const g = this.add.graphics();
    g.fillStyle(shadowColor, 0.45);
    g.fillTriangle(w * 0.5 + 2, h + 1, 0 + 2, h * 0.52 + 1, w + 2, h * 0.52 + 1);

    g.fillStyle(colorMain, 1);
    g.fillTriangle(w * 0.5, 0, 0, h * 0.9, w, h * 0.9);
    g.fillStyle(colorCore, 0.95);
    g.fillRect(w * 0.36, h * 0.34, w * 0.28, h * 0.38);
    g.fillStyle(0xffffff, 0.65);
    g.fillRect(w * 0.44, h * 0.2, w * 0.12, h * 0.2);
    g.generateTexture(key, w + 4, h + 4);
    g.destroy();
  }

  makeBulletTexture(key, glowColor, coreColor, w, h) {
    const g = this.add.graphics();
    g.fillStyle(glowColor, 0.3);
    g.fillRoundedRect(0, 0, w + 4, h + 4, 3);
    g.fillStyle(coreColor, 1);
    g.fillRoundedRect(2, 2, w, h, 2);
    g.generateTexture(key, w + 4, h + 4);
    g.destroy();
  }

  makeTurretTexture() {
    const g = this.add.graphics();
    g.fillStyle(0x1f2c3f, 1);
    g.fillCircle(16, 16, 14);
    g.fillStyle(0x637da1, 1);
    g.fillCircle(16, 16, 8);
    g.fillStyle(0xffa067, 1);
    g.fillRect(14, 3, 4, 14);
    g.generateTexture('turret', 32, 32);
    g.destroy();
  }

  makeTerrainTextures() {
    const g = this.add.graphics();
    g.fillStyle(0x172535, 1);
    g.fillRect(0, 0, 96, 192);
    for (let y = 0; y < 192; y += 32) {
      g.fillStyle(0x23394f, 1);
      g.fillRect(8, y + 4, 80, 22);
      g.fillStyle(0x0f1a26, 1);
      g.fillRect(8, y + 26, 80, 4);
      g.fillStyle(0xff9955, 0.8);
      g.fillCircle(16, y + 15, 2);
      g.fillCircle(80, y + 15, 2);
    }
    g.generateTexture('terrain', 96, 192);
    g.destroy();

    const stars = this.add.graphics();
    stars.fillStyle(0x08121d, 1);
    stars.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    for (let i = 0; i < 90; i += 1) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const r = Phaser.Math.Between(1, 2);
      stars.fillStyle(0x6aa8d6, Phaser.Math.FloatBetween(0.2, 0.75));
      stars.fillCircle(x, y, r);
    }
    stars.generateTexture('starfield', GAME_WIDTH, GAME_HEIGHT);
    stars.destroy();
  }

  makeParticleTexture() {
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8);
    g.destroy();
  }
}
