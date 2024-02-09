import { Standing, Running } from '../playerStates/playerStates.js';

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
    this.speed; // test key
    this.maxSpeed = 7; // test key
    this.frameX;
    this.frameY;
    this.maxFrame;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.states = [new Standing(this), new Running(this)];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(deltaTime) {
    // Update based on currentState
    this.currentState.handleInput(this.game.input.keys);
    // Update game.speed based on player moves
    this.game.speed = this.speed;
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
  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

const playerImage = document.getElementById('player');

