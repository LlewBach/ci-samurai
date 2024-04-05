import { Standing, Walking, Dying, Spawning, Turning, Attack1, Attack2 } from '../enemy-states/enemy-states.js';

// This implementation of game enemies is by me, and includes features such as enemy states, enemy bidirectionality, short and long-range detection and player-centric motion control.

const zombie1 = document.getElementById('zombie1');
const zombie2 = document.getElementById('zombie2');

class Zombie {
  constructor(game, startingState) {
    this.game = game;
    // Sprite sheet frame dimensions
    this.spriteWidth = 130;
    this.spriteHeight = 70;
    this.width = this.spriteWidth * 2;
    this.height = this.spriteHeight * 2;
    this.x = startingState === 0 ? this.game.width : this.game.width * Math.random();
    this.y = this.game.height - this.game.groundMargin - this.height;
    this.hitMargin = 100;
    this.yContactMargin = 20;
    // Setting this to either 1 or -1 controls the direction the enemy faces.
    this.facingRight = -1;
    // The values for the range properties are set by player.js, as these are set relative to the player.
    this.inShortRange = 0;
    this.inLongRange = 0;
    this.attackChoice = Math.random();
    // This flag allows adjustment of jump speed and attack range margin.
    this.jumpAttacking = false;
    this.markedForDeletion = false;
    this.speed = 0;
    this.maxSpeed = 1;
    this.jumpSpeed = 6;
    this.frameX = 0;
    this.maxFrame = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [new Standing(this.game, this), new Walking(this.game, this), new Dying(this.game, this), new Spawning(this.game, this), new Turning(this.game, this), new Attack1(this.game, this), new Attack2(this.game, this)];
    this.currentState = this.states[startingState];
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
    // The facingRight property allows the context to flip the scale across the Y axis, thus enabling enemies to face both directions.
    context.scale(this.facingRight, 1);
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x * this.facingRight, this.y, this.width * this.facingRight, this.height);
    context.restore();
  }
}

export class Zombie1 extends Zombie {
  constructor(game, startingState) {
    super(game, startingState);
    this.image = zombie1;
  }
}

export class Zombie2 extends Zombie {
  constructor(game, startingState) {
    super(game, startingState);
    this.image = zombie2;
  }
}