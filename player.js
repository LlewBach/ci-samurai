export class Player {
  constructor(game) {
    this.game = game;
    this.image = playerImage;
    this.spriteWidth = 288;
    this.spriteHeight = 128;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.x = (this.game.width - this.width) / 2;
    this.y = this.game.height - this.height;
    this.frameX = 0;
    this.frameY = 0;
  }
  update() {

  }
  draw() {

  }
}

const playerImage = document.getElementById('player');