import { Standing, Running, Jumping, Falling, Rolling } from '../playerStates/playerStates.js';

export class Player {
  constructor(game) {
    this.game = game;
    this.image = playerImage;
    this.spriteWidth = 288;
    this.spriteHeight = 128;
    this.width = this.spriteWidth * 2.2;
    this.height = this.spriteHeight * 2.2;
    this.x = (this.game.width - this.width) / 2;
    this.y = this.game.height - this.game.groundMargin - this.height;
    this.facingRight;
    this.speed;
    this.maxSpeed = 7;
    this.vy = 0;
    this.gravity = 1;
    this.frameX;
    this.frameY;
    this.maxFrame;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [new Standing(this), new Running(this), new Jumping(this), new Falling(this), new Rolling(this)];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(deltaTime) {
    // Update based on currentState
    this.currentState.handleInput(this.game.input.keys);
    // Update game.speed based on player moves
    this.game.speed = this.speed;
    // Update vertical position
    this.y += this.vy;
    // Update vy
    if (!this.onGround()) this.vy += this.gravity;
    // Ground boundary
    if (this.onGround()) {
      this.vy = 0;
      // this.y = this.game.height - this.game.groundMargin - this.height;
    }
    // Sprite animation
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
  onGround() {
    return this.y >= this.game.height - this.game.groundMargin - this.height;
  }
  draw(context) {
    context.save();
    context.scale(this.facingRight, 1);
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x * this.facingRight, this.y, this.width * this.facingRight, this.height);
    context.restore();
  }
}

const playerImage = document.getElementById('player');

