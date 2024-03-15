import { Standing, Walking, Dying, Spawning, Turning, Attack1, Attack2 } from '../enemyStates/enemyStates.js';

const zombie1 = document.getElementById('zombie1');
const zombie2 = document.getElementById('zombie2');

class Zombie {
  constructor(game) {
    this.game = game;
    this.spriteWidth = 130;
    this.spriteHeight = 70;
    this.width = this.spriteWidth * 2;
    this.height = this.spriteHeight * 2;
    this.y = this.game.height - this.game.groundMargin - this.height;
    this.hitMargin = 100;
    this.yContactMargin = 20;
    this.facingRight = -1;
    this.inShortRange = 0;
    this.inLongRange = 0;
    this.attackChoice = Math.random();
    this.jumpAttacking = false;
    this.markedForDeletion = false;
    this.speed = 0;
    this.frameX = 0;
    this.maxFrame;
    this.frameY;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [new Standing(this.game, this), new Walking(this.game, this), new Dying(this.game, this), new Spawning(this.game, this), new Turning(this.game, this), new Attack1(this.game, this), new Attack2(this.game, this)];
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
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  draw(context) {
    context.save();
    if (this.game.annotateMode) {
      // Sprite boundary box
      context.strokeStyle = 'black';
      context.strokeRect(this.x, this.y, this.width, this.height);
      // Hit box
      context.strokeStyle = 'blue';
      context.strokeRect(this.x + this.hitMargin, this.y + this.yContactMargin, this.width - (2 * this.hitMargin), this.height - this.yContactMargin);
    }
    // Sprite
    context.scale(this.facingRight, 1);
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x * this.facingRight, this.y, this.width * this.facingRight, this.height);
    context.restore();
  }
}

export class Zombie1 extends Zombie {
  constructor(game) {
    super(game);
    this.image = zombie1;
    this.x = this.game.width;
    this.maxSpeed = 1;
    this.jumpSpeed = 6;
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
  draw(context) {
    super.draw(context);
  }
}

export class Zombie2 extends Zombie {
  constructor(game) {
    super(game);
    this.image = zombie2;
    this.x = this.game.width * Math.random();
    this.maxSpeed = 1;
    this.jumpSpeed = 6;
    this.currentState = this.states[3];
    this.currentState.enter();
  }
  update(deltaTime) {
    super.update(deltaTime);
  }
  draw(context) {
    super.draw(context);
  }
}