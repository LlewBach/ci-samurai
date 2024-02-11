import { Standing } from '../enemyStates/enemyStates.js';

const zombie1 = document.getElementById('zombie1');

export class Zombie1 {
  constructor(game) {
    this.game = game;
    this.image = zombie1;
    this.spriteWidth = 130;
    this.spriteHeight = 70;
    this.width = this.spriteWidth * 2;
    this.height = this.spriteHeight * 2;
    this.x = this.game.width - this.width;
    this.y = this.game.height - this.game.groundMargin - this.height;
    this.facingRight = -1;
    this.speed = 0;
    this.frameX = 0;
    this.maxFrame;
    this.frameY;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [new Standing(this.game, this)];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(deltaTime) {
    // currentState update
    this.currentState.update();
    // Motion
    this.x -= this.speed;
    // Animation
    if (this.frameTimer < this.frameInterval) this.frameTimer += deltaTime;
    else {
      this.frameTimer = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    }
  }
  draw(context) {
    context.save();
    context.scale(this.facingRight, 1);
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x * this.facingRight, this.y, this.width * this.facingRight, this.height);
    context.restore();
  }
}