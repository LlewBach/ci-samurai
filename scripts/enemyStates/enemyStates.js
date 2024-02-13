const states = {
  STANDING: 0,
  WALKING: 1,
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
    // needs testing
    if (this.enemy.x < this.game.width - this.enemy.width) this.enemy.setState(states.WALKING);
  }
}

// needs testing
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