import { Standing, Running, Jumping, Falling, Rolling, Stun, Attack1, Attack2, Attack3, Seppaku, Transcending } from '../playerStates/playerStates.js';

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
    this.attackMargin = 160;
    this.hitMargin = 290;
    this.yContactMargin = 180;
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
    this.states = [new Standing(this), new Running(this), new Jumping(this), new Falling(this), new Rolling(this), new Stun(this, this.game), new Attack1(this, this.game), new Attack2(this, this.game), new Attack3(this, this.game), new Seppaku(this), new Transcending(this)];
    this.currentState = this.states[0];
    this.currentState.enter();
  }
  update(deltaTime) {
    this.winCheck();
    // Check enemy range status
    this.shortRangeCheck();
    this.longRangeCheck();
    // Check player contact status
    if (
      (this.hitCheck() || this.jumpAttackCheck()) &&
      this.currentState !== this.states[4] &&
      this.currentState !== this.states[5] &&
      this.currentState !== this.states[9] &&
      this.currentState !== this.states[10]) {
      this.setState(5);
      if (this.game.health > 3) this.game.health -= 3;
      else if (this.game.health > 0) this.game.health = 0;
    }
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
      else {
        if (this.currentState === this.states[9] || this.currentState === this.states[10]) {
          this.frameX = this.maxFrame;
        }
        else this.frameX = 0;
      }
    }
  }
  setState(state) {
    this.currentState = this.states[state];
    this.currentState.enter();
  }
  onGround() {
    return this.y >= this.game.height - this.game.groundMargin - this.height;
  }
  shortRangeCheck() {
    this.game.enemies.forEach(enemy => {
      if (enemy.jumpAttacking) enemy.hitMargin = 0;
      else enemy.hitMargin = 100;
      if (
        enemy.x + enemy.hitMargin < this.x + this.width - this.attackMargin &&
        enemy.x + (enemy.width / 2) > this.x + (this.width / 2)
      ) enemy.inShortRange = 1;
      else if (
        enemy.x + enemy.width - enemy.hitMargin > this.x + this.attackMargin &&
        enemy.x + (enemy.width / 2) < this.x + (this.width / 2)
      ) enemy.inShortRange = -1;
      else enemy.inShortRange = 0;
    });
  }
  longRangeCheck() {
    this.game.enemies.forEach(enemy => {
      if (
        enemy.x + enemy.hitMargin < this.x + this.width &&
        enemy.x + (enemy.width / 2) > this.x + (this.width / 2)
      ) enemy.inLongRange = 1;
      else if (
        enemy.x + enemy.width - enemy.hitMargin > this.x &&
        enemy.x + (enemy.width / 2) < this.x + (this.width / 2)
      ) enemy.inLongRange = -1;
    });
  }
  hitCheck() {
    return (
      this.game.enemies.some(enemy => {
        return (
          enemy.x + enemy.hitMargin < this.x + this.width - this.hitMargin &&
          enemy.x + enemy.width - enemy.hitMargin > this.x + this.hitMargin &&
          enemy.y + enemy.yContactMargin < this.y + this.height &&
          enemy.currentState !== enemy.states[2]
        );
      })
    );
  }
  jumpAttackCheck() {
    return (
      this.game.enemies.some(enemy => {
        return (
          (enemy.jumpAttacking === true &&
            enemy.facingRight === -1 &&
            enemy.x < this.x + this.width - this.hitMargin) &&
          enemy.x + (enemy.width / 2) > this.x + (this.width / 2) ||
          (enemy.jumpAttacking === true &&
            enemy.facingRight === 1 &&
            enemy.x + enemy.width > this.x + this.hitMargin &&
            enemy.x + (enemy.width / 2) < this.x + (this.width / 2))
        );
      })
    )
  }
  winCheck() {
    if (this.game.score >= this.game.winningScore && !this.game.gameOver) {
      this.setState(10);
      this.game.gameOver = true;
    }
  }
  draw(context) {
    context.save();
    // Sprite box
    context.strokeStyle = 'black';
    context.strokeRect(this.x, this.y, this.width, this.height);
    // Attack box
    context.strokeStyle = 'red';
    context.strokeRect(this.x + this.attackMargin, this.y + this.yContactMargin, this.width - (2 * this.attackMargin), this.height - this.yContactMargin);
    // Hit box
    context.strokeStyle = 'blue';
    context.strokeRect(this.x + this.hitMargin, this.y + this.yContactMargin, this.width - (2 * this.hitMargin), this.height - this.yContactMargin);
    context.scale(this.facingRight, 1);
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x * this.facingRight, this.y, this.width * this.facingRight, this.height);
    context.restore();
  }
}

const playerImage = document.getElementById('player');

