const states = {
  STANDING: 0,
  WALKING: 1,
  DYING: 2,
  SPAWNING: 3,
  TURNING: 4,
  ATTACK1: 5,
  ATTACK2: 6,
}

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
    this.enemy.speed = this.game.speed;
    if (this.enemy.x < this.game.width - this.enemy.width) this.enemy.setState(states.WALKING);
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
    if (this.enemy.attackChoice < 0.2) {
      if (this.enemy.x < this.game.player.x + this.game.player.width - (this.game.player.attackMargin * 0.8) &&
        this.enemy.x + (this.enemy.width / 2) > this.game.player.x + (this.game.player.width / 2) &&
        this.enemy.facingRight === -1) this.enemy.setState(states.ATTACK2);
      else if (this.enemy.x + this.enemy.width > this.game.player.x + (this.game.player.attackMargin * 0.8) &&
        this.enemy.x + (this.enemy.width / 2) < this.game.player.x + (this.game.player.width / 2) &&
        this.enemy.facingRight === 1) this.enemy.setState(states.ATTACK2);
    }

    if (this.enemy.x + this.enemy.width - this.enemy.hitMargin < this.game.player.x + this.game.player.attackMargin && this.enemy.facingRight === -1) this.enemy.setState(states.TURNING);
    else if (this.enemy.x + this.enemy.hitMargin > this.game.player.x + this.game.player.width - this.game.player.attackMargin && this.enemy.facingRight === 1) this.enemy.setState(states.TURNING);

    else if (this.enemy.x + this.enemy.width - this.enemy.hitMargin > this.game.player.x + this.game.player.hitMargin && this.enemy.x + (this.enemy.width / 2) < this.game.player.x + (this.game.player.width / 2) && this.enemy.facingRight === 1) this.enemy.setState(states.ATTACK1);
    else if (this.enemy.x + this.enemy.hitMargin < this.game.player.x + this.game.player.width - this.game.player.hitMargin && this.enemy.x + (this.enemy.width / 2) > this.game.player.x + (this.game.player.width / 2) && this.enemy.facingRight === -1) this.enemy.setState(states.ATTACK1);
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
    if (this.enemy.frameX === 11) {
      this.enemy.frameX = 0;
      this.enemy.frameY++;
    } else if (this.enemy.frameX === 3) {
      this.enemy.markedForDeletion = true;
      this.game.score++;
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
    if (this.enemy.frameX === 10 && this.game.player.onGround() && this.game.health > 0) this.game.health -= 1;
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