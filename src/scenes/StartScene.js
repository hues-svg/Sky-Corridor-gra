import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('start');
  }

  create() {
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'starfield');

    const title = this.add.text(GAME_WIDTH / 2, 180, 'SKY CORRIDOR', {
      fontFamily: 'Arial Black',
      fontSize: '42px',
      color: '#68f2ff',
      stroke: '#0d2032',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      alpha: { from: 0.7, to: 1 },
      duration: 900,
      yoyo: true,
      repeat: -1,
    });

    this.add.text(GAME_WIDTH / 2, 320, 'Move: WASD / Arrows / Drag\nFire: Space / Touch hold', {
      align: 'center',
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#d9f5ff',
      lineSpacing: 10,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 500, 'Tap or Press Enter to Launch', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#ffbf74',
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('game'));
  }
}
