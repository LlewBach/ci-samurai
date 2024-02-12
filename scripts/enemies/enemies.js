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
    this.hitMargin = 100; // new
    this.yContactMargin = 20; // new
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
    // Sprite boundary box
    context.strokeStyle = 'black';
    context.strokeRect(this.x, this.y, this.width, this.height);
    // Hit box
    context.strokeStyle = 'blue';
    context.strokeRect(this.x + this.hitMargin, this.y + this.yContactMargin, this.width - (2 * this.hitMargin) + 15, this.height - this.yContactMargin);
    context.scale(this.facingRight, 1);
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x * this.facingRight, this.y, this.width * this.facingRight, this.height);
    context.restore();
  }
}