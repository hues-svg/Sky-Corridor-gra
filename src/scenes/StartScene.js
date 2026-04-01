import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('start');
  }

  create() {
    this.add.tileSprite(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 'starfield');
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x061425, 0.45);

    // Reserved center space for future menu background art swap.
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH * 0.78, GAME_HEIGHT * 0.45, 0x0b2034, 0.42)
      .setStrokeStyle(2, 0x6ad8ff, 0.5);

    const playButton = this.add.container(GAME_WIDTH / 2, GAME_HEIGHT * 0.62);
    const base = this.add.rectangle(0, 0, 220, 82, 0x1ed2ff, 0.92).setStrokeStyle(4, 0xa9f5ff, 0.9);
    const label = this.add.text(0, 0, 'PLAY', {
      fontFamily: 'Arial Black',
      fontSize: '42px',
      color: '#032033',
    }).setOrigin(0.5);

    playButton.add([base, label]);
    playButton.setSize(220, 82);
    playButton.setInteractive({ useHandCursor: true });

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.22, 'SKY CORRIDOR', {
      fontFamily: 'Arial Black',
      fontSize: '36px',
      color: '#8feeff',
      stroke: '#07111a',
      strokeThickness: 6,
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.75, 'Touch and drag to fly\nAuto-fire while touching', {
      align: 'center',
      fontFamily: 'Verdana',
      fontSize: '18px',
      color: '#d3ecff',
      lineSpacing: 8,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: playButton,
      scaleX: { from: 1, to: 1.05 },
      scaleY: { from: 1, to: 1.05 },
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    const launch = () => this.scene.start('game');
    playButton.on('pointerdown', launch);
    this.input.keyboard.once('keydown-ENTER', launch);
  }
}
