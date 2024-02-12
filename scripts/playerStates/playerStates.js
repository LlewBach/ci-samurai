const states = {
  STANDING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  ATTACK1: 5,
}

class State {
  constructor(player) {
    this.player = player;
  }
}

export class Standing extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 9;
    this.player.frameY = 0;
    this.player.facingRight = 1;
    this.player.speed = 0;
  }
  handleInput(inputKeys) {
    if (inputKeys.includes('ArrowLeft')) {
      this.player.setState(states.RUNNING);
    } else if (inputKeys.includes('ArrowRight')) {
      this.player.setState(states.RUNNING);
    } else if (inputKeys.includes('ArrowUp')) {
      this.player.setState(states.JUMPING);
    } else if (inputKeys.includes('a') || inputKeys.includes('A')) {
      if (inputKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK1);
    }
  }
}

export class Running extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 7;
    this.player.frameY = 1;

  }
  handleInput(inputKeys) {
    // No horizontal arrow pressed
    if (!inputKeys.includes('ArrowLeft') && !inputKeys.includes('ArrowRight')) {
      this.player.setState(states.STANDING);
    }
    // One horizontal arrow pressed
    if (inputKeys.includes('ArrowLeft') && !inputKeys.includes('ArrowRight')) {
      this.player.facingRight = -1;
      this.player.speed = -this.player.maxSpeed;
    } else if (inputKeys.includes('ArrowRight') && !inputKeys.includes('ArrowLeft')) {
      this.player.facingRight = 1;
      this.player.speed = this.player.maxSpeed;
    }
    // ArrowUp pressed
    if (inputKeys.includes('ArrowUp')) this.player.setState(states.JUMPING);
    else if (inputKeys.includes('a')) this.player.setState(states.ATTACK1);
  }
}

export class Jumping extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 2;
    this.player.frameY = 2;
    this.player.vy = -24;
  }
  handleInput() {
    if (this.player.vy >= 0) this.player.setState(states.FALLING);
  }
}

export class Falling extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 2;
    this.player.frameY = 3;
  }
  handleInput(inputKeys) {
    if (this.player.onGround() && inputKeys.includes('ArrowDown')) this.player.setState(states.ROLLING);
    else if (this.player.onGround() && (inputKeys.includes('ArrowRight') || inputKeys.includes('ArrowLeft'))) this.player.setState(states.RUNNING);
    else if (this.player.onGround()) this.player.setState(states.STANDING);
  }
}

export class Rolling extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 7;
    this.player.frameY = 6;
  }
  handleInput(inputKeys) {
    if (this.player.speed === 0) {
      if (inputKeys.includes('ArrowLeft')) {
        this.player.facingRight = -1;
        this.player.speed = -this.player.maxSpeed;
      } else {
        this.player.speed = this.player.maxSpeed;
      }
    }
    if (this.player.frameX === this.player.maxFrame && (!inputKeys.includes('ArrowLeft') && !inputKeys.includes('ArrowRight'))) this.player.setState(states.STANDING);
    else if (this.player.frameX === this.player.maxFrame && (inputKeys.includes('ArrowLeft') || inputKeys.includes('ArrowRight'))) this.player.setState(states.RUNNING);
  }
}

export class Attack1 extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 7;
    this.player.frameY = 9;
    for (let i = 0; i < this.game.enemies.length; i++) {
      if (this.game.enemies[i].inShortRange === 1 && this.player.facingRight === 1) {
        this.game.enemies[i].markedForDeletion = true;
        break;
      } else if (this.game.enemies[i].inShortRange === -1 && this.player.facingRight === -1) {
        this.game.enemies[i].markedForDeletion = true;
      }
    }
  }
  handleInput(inputKeys) {
    if (this.player.frameX === this.player.maxFrame) this.player.setState(states.STANDING);
  }
}