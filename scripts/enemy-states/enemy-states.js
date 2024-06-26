import { ZombieBlood, PlayerBlood } from '../particles/particles.js';
import { FloatingText } from '../floating-text/floating-text.js';

// The code in this file is completely my own.

const states = {
  STANDING: 0,
  WALKING: 1,
  DYING: 2,
  SPAWNING: 3,
  TURNING: 4,
  ATTACK1: 5,
  ATTACK2: 6,
};

class State {
  constructor(game, enemy) {
    this.game = game;
    this.enemy = enemy;
  }
}

export class Standing extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 0;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 2;
  }
  update() {
    // This makes the character stationary relative to the floor
    this.enemy.speed = this.game.speed;
    if ((this.enemy.x < this.game.width - this.enemy.width / 2) || this.enemy.frameX === this.enemy.maxFrame) this.enemy.setState(states.WALKING);
  }
}

export class Walking extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 0;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 3;
  }
  update() {
    this.enemy.speed = this.game.speed - (this.enemy.maxSpeed * this.enemy.facingRight);
    // Attack2 transitions, dependent on distance from player, direction, and gameOver
    if (this.enemy.attackChoice < 0.2) {
      if (
        this.enemy.x < this.game.player.x + this.game.player.width - (this.game.player.attackMargin * 0.8) &&
        this.enemy.x + (this.enemy.width / 2) > this.game.player.x + (this.game.player.width / 2) &&
        this.enemy.facingRight === -1 &&
        !this.game.gameOver
      ) this.enemy.setState(states.ATTACK2);
      else if (
        this.enemy.x + this.enemy.width > this.game.player.x + (this.game.player.attackMargin * 0.8) &&
        this.enemy.x + (this.enemy.width / 2) < this.game.player.x + (this.game.player.width / 2) &&
        this.enemy.facingRight === 1 &&
        !this.game.gameOver
      ) this.enemy.setState(states.ATTACK2);
    }
    // Turning transitions, dependent on distance from player, direction, and gameOver
    if (
      this.enemy.x + this.enemy.width - this.enemy.hitMargin < this.game.player.x + this.game.player.attackMargin &&
      this.enemy.facingRight === -1 &&
      !this.game.gameOver
    ) this.enemy.setState(states.TURNING);
    else if (
      this.enemy.x + this.enemy.hitMargin > this.game.player.x + this.game.player.width - this.game.player.attackMargin &&
      this.enemy.facingRight === 1 &&
      !this.game.gameOver
    ) this.enemy.setState(states.TURNING);
    // Attack1 transitions, if hit boxes touching and facing correct direction.
    else if (
      this.enemy.x + this.enemy.width - this.enemy.hitMargin > this.game.player.x + this.game.player.hitMargin &&
      this.enemy.x + (this.enemy.width / 2) < this.game.player.x + (this.game.player.width / 2) &&
      this.enemy.facingRight === 1 &&
      !this.game.gameOver
    ) this.enemy.setState(states.ATTACK1);
    else if (
      this.enemy.x + this.enemy.hitMargin < this.game.player.x + this.game.player.width - this.game.player.hitMargin &&
      this.enemy.x + (this.enemy.width / 2) > this.game.player.x + (this.game.player.width / 2) &&
      this.enemy.facingRight === -1 &&
      !this.game.gameOver
    ) this.enemy.setState(states.ATTACK1);
  }
}

export class Dying extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 10;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 10;
  }
  update() {
    this.enemy.speed = this.game.speed;
    if (this.enemy.frameY === 10) {
      for (let i = 0; i < 10; i++) {
        this.game.particles.unshift(new ZombieBlood(this.game, this.enemy.x + (this.enemy.width / 2), this.enemy.y + (this.enemy.height / 2)));
      }
    }
    // This animation runs onto next line of spritesheet
    if (this.enemy.frameX === 11) {
      this.enemy.frameX = 0;
      this.enemy.frameY++;
      this.game.floatingText.push(new FloatingText('+1', this.enemy.x, this.enemy.y, 110, 50));
      this.game.floatingText.push(new FloatingText('+5', this.enemy.x, this.enemy.y, 380, 50));
    } else if (this.enemy.frameX === 3) {
      this.enemy.markedForDeletion = true;
      this.game.score++;
      if (this.game.energy <= 95) this.game.energy += 5;
      else this.game.energy = 100;
    }
  }
}

export class Spawning extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 0;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 0;
  }
  update() {
    this.enemy.speed = this.game.speed;
    if (this.enemy.frameX === 11 && this.enemy.frameY === 0) {
      this.enemy.frameX = 0;
      this.enemy.frameY = 1;
    } else if (this.enemy.frameX === 11 && this.enemy.frameY === 1) this.enemy.setState(states.STANDING);
  }
}

export class Turning extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 9;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 3;
  }
  update() {
    this.enemy.speed = this.game.speed;
    if (this.enemy.frameX === 11) {
      this.enemy.frameX = 0;
      this.enemy.frameY = 4;
    } else if (this.enemy.frameX === 4) {
      // Once frame sequence finished, flip facingRight sign.
      this.enemy.facingRight *= -1;
      this.enemy.setState(states.WALKING);
    }
  }
}

export class Attack1 extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 5;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 4;
  }
  update() {
    this.enemy.speed = this.game.speed;
    // For duration of one frame, player takes damage and blood spatters.
    if (this.enemy.frameX === 10 && this.game.player.onGround() && this.game.health > 0) {
      this.game.health -= 1;
      for (let i = 0; i < 10; i++) {
        this.game.particles.unshift(new PlayerBlood(this.game, this.game.player.x + (this.game.player.width / 2), this.game.height - ((this.game.player.y + this.game.player.yContactMargin) / 2), this.enemy.facingRight));
      }
    }
    if (this.enemy.frameX === 11) {
      this.enemy.frameX = 0;
      this.enemy.frameY = 5;
    } else if (this.enemy.frameX === 6 && this.enemy.frameY === 5) this.enemy.setState(states.STANDING);
  }
}

export class Attack2 extends State {
  constructor(game, enemy) {
    super(game, enemy);
  }
  enter() {
    this.enemy.frameX = 9;
    this.enemy.maxFrame = 11;
    this.enemy.frameY = 5;
  }
  update() {
    this.enemy.speed = this.game.speed;
    if (this.enemy.frameX === 11 && this.enemy.frameY !== 7) {
      this.enemy.frameX = 0;
      this.enemy.frameY++;
    } else if (this.enemy.frameX >= 3 && this.enemy.frameX <= 7 && this.enemy.frameY === 6) {
      this.enemy.jumpAttacking = true;
      this.enemy.speed = this.game.speed - (this.enemy.jumpSpeed * this.enemy.facingRight);
    }
    else if (this.enemy.frameX === 8 && this.enemy.frameY === 6) this.enemy.jumpAttacking = false;
    else if (this.enemy.frameX === 9 && this.enemy.frameY === 7) this.enemy.setState(states.STANDING);
  }
}