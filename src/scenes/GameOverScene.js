import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  create(data) {
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'starfield');
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.45);

    this.add.text(GAME_WIDTH / 2, 220, 'MISSION FAILED', {
      fontFamily: 'Arial Black',
      fontSize: '44px',
      color: '#ff7a7a',
      stroke: '#3c0b0b',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 340, `Score: ${data.score ?? 0}\nBest: ${data.best ?? 0}`, {
      align: 'center',
      fontFamily: 'Verdana',
      fontSize: '30px',
      color: '#e9f7ff',
      lineSpacing: 12,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, 520, 'Tap or Press Enter to Retry', {
      fontFamily: 'Verdana',
      fontSize: '24px',
      color: '#ffd28a',
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('game'));
  }
}
