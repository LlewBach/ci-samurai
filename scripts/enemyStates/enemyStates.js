const states = {
  STANDING: 0,
  WALKING: 1,
  DYING: 2,
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
    this.enemy.speed = this.game.speed + this.enemy.maxSpeed;
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
    } else if (this.enemy.frameX === 3) this.enemy.markedForDeletion = true;
  }
}

// need to test
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