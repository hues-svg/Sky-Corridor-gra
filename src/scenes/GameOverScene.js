import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  create(data) {
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'starfield');
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5);

    this.add.text(GAME_WIDTH / 2, 220, 'GAME OVER', {
      fontFamily: 'Arial Black',
      fontSize: '48px',
      color: '#ff8383',
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

    const replayBtn = this.add.container(GAME_WIDTH / 2, 540);
    const base = this.add.rectangle(0, 0, 240, 78, 0x27d3ff, 0.95).setStrokeStyle(4, 0xb7f2ff, 0.9);
    const label = this.add.text(0, 0, 'REPLAY', {
      fontFamily: 'Arial Black',
      fontSize: '34px',
      color: '#042033',
    }).setOrigin(0.5);
    replayBtn.add([base, label]);
    replayBtn.setSize(240, 78);
    replayBtn.setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: replayBtn,
      scaleX: { from: 1, to: 1.04 },
      scaleY: { from: 1, to: 1.04 },
      duration: 620,
      yoyo: true,
      repeat: -1,
    });

    const restart = () => this.scene.start('game');
    replayBtn.on('pointerdown', restart);
    this.input.keyboard.once('keydown-ENTER', restart);
  }
}
