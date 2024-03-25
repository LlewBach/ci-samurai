import { PlayerBlood } from '../particles/particles.js';

const states = {
  STANDING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  STUN: 5,
  ATTACK1: 6,
  ATTACK2: 7,
  ATTACK3: 8,
  SEPPAKU: 9,
  TRANSCENDING: 10,
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
  handleInput(inputKeys, joystickKeys, controlPadKeys) {
    if (inputKeys.includes('ArrowLeft') || joystickKeys.includes('ArrowLeft')) {
      this.player.setState(states.RUNNING);
    } else if (inputKeys.includes('ArrowRight') || joystickKeys.includes('ArrowRight')) {
      this.player.setState(states.RUNNING);
    } else if (inputKeys.includes('ArrowUp') || joystickKeys.includes('ArrowUp')) {
      this.player.setState(states.JUMPING);
    } else if ((inputKeys.includes('a') || inputKeys.includes('A') || controlPadKeys.includes('a')) && this.player.game.energy >= 1) {
      if (inputKeys.includes('Shift') || joystickKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK1);
    } else if ((inputKeys.includes('s') || inputKeys.includes('S') || controlPadKeys.includes('s')) && this.player.game.energy >= 5) {
      if (inputKeys.includes('Shift') || joystickKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK2);
    } else if ((inputKeys.includes('d') || inputKeys.includes('D') || controlPadKeys.includes('d')) && this.player.game.energy >= 30) {
      if (inputKeys.includes('Shift') || joystickKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK3);
    } else if (this.player.game.trainingMode && this.player.game.score === 10) {
      this.player.setState(states.TRANSCENDING);
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
  handleInput(inputKeys, joystickKeys, controlPadKeys) {
    // No horizontal arrow pressed
    if (!inputKeys.includes('ArrowLeft') && !inputKeys.includes('ArrowRight') && !joystickKeys.includes('ArrowLeft') && !joystickKeys.includes('ArrowRight')) {
      this.player.setState(states.STANDING);
    }
    // One horizontal arrow pressed
    if ((inputKeys.includes('ArrowLeft') || joystickKeys.includes('ArrowLeft')) && !inputKeys.includes('ArrowRight')) {
      this.player.facingRight = -1;
      this.player.speed = -this.player.maxSpeed;
      if (this.player.game.trainingMode && this.player.game.score === 3) this.player.game.score++;
    } else if ((inputKeys.includes('ArrowRight') || joystickKeys.includes('ArrowRight')) && !inputKeys.includes('ArrowLeft')) {
      this.player.facingRight = 1;
      this.player.speed = this.player.maxSpeed;
      if (this.player.game.trainingMode && this.player.game.score === 2) this.player.game.score++;
    }
    // ArrowUp pressed
    if (inputKeys.includes('ArrowUp') || joystickKeys.includes('ArrowUp')) this.player.setState(states.JUMPING);
    // Attack buttons
    else if ((inputKeys.includes('a') || inputKeys.includes('A') || controlPadKeys.includes('a')) && this.player.game.energy >= 1) this.player.setState(states.ATTACK1);
    else if ((inputKeys.includes('s') || inputKeys.includes('S') || controlPadKeys.includes('s')) && this.player.game.energy >= 5) this.player.setState(states.ATTACK2);
    else if ((inputKeys.includes('d') || inputKeys.includes('D') || controlPadKeys.includes('d')) && this.player.game.energy >= 30) this.player.setState(states.ATTACK3);
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
    if (this.player.game.trainingMode && this.player.game.score === 0) this.player.game.score++;
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
    this.player.game.energy++;
  }
  handleInput(inputKeys, joystickKeys) {
    if (this.player.onGround() && (inputKeys.includes('ArrowDown') || joystickKeys.includes('ArrowDown'))) this.player.setState(states.ROLLING);
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
    if (this.player.game.trainingMode && this.player.game.score === 1) this.player.game.score++;
  }
  handleInput(inputKeys, joystickKeys) {
    if (this.player.speed === 0) {
      if (inputKeys.includes('ArrowLeft') || joystickKeys.includes('ArrowLeft')) {
        this.player.facingRight = -1;
        this.player.speed = -this.player.maxSpeed;
      } else {
        this.player.speed = this.player.maxSpeed;
      }
    }
    if (this.player.frameX === this.player.maxFrame && this.player.game.health === 0) this.player.setState(states.SEPPAKU);
    else if (this.player.frameX === this.player.maxFrame && (!inputKeys.includes('ArrowLeft') && !inputKeys.includes('ArrowRight') && !joystickKeys.includes('ArrowLeft') && !joystickKeys.includes('ArrowRight'))) this.player.setState(states.STANDING);
    else if (this.player.frameX === this.player.maxFrame && (inputKeys.includes('ArrowLeft') || inputKeys.includes('ArrowRight') || joystickKeys.includes('ArrowLeft') || joystickKeys.includes('ArrowRight'))) this.player.setState(states.RUNNING);
  }
}

export class Stun extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 5;
    this.player.frameY = 14;
    if (this.player.onGround()) this.player.speed = 0;
  }
  handleInput(inputKeys, joystickKeys) {
    if (this.player.frameX === 5) {
      if (this.player.onGround()) this.player.setState(states.STANDING);
      else this.player.setState(states.FALLING);
    }
    if ((inputKeys.includes('ArrowUp') && this.player.onGround()) || joystickKeys.includes('ArrowUp') && this.player.onGround()) this.player.setState(states.JUMPING);
    else if ((inputKeys.includes('ArrowDown') && this.player.onGround()) || joystickKeys.includes('ArrowDown') && this.player.onGround()) this.player.setState(states.ROLLING);
    if (this.game.gameOver) this.player.setState(states.SEPPAKU);
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
    this.player.speed = 0;
    this.game.energy--;
    if (this.player.facingRight === 1 && this.game.trainingMode && this.game.score === 4) this.game.score++;
    else if (this.player.facingRight === -1 && this.game.trainingMode && this.game.score === 5) this.game.score++;
    for (let i = 0; i < this.game.enemies.length; i++) {
      if (this.game.enemies[i].inShortRange === 1 && this.player.facingRight === 1) {
        this.game.enemies[i].setState(2);
        break;
      } else if (this.game.enemies[i].inShortRange === -1 && this.player.facingRight === -1) {
        this.game.enemies[i].setState(2);
        break;
      }
    }
  }
  handleInput(inputKeys) {
    if (this.player.frameX === this.player.maxFrame) this.player.setState(states.STANDING);
  }
}

export class Attack2 extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 9;
    this.player.frameY = 10;
    this.player.speed = 0;
    this.game.energy -= 5;
    if (this.player.facingRight === 1 && this.game.trainingMode && this.game.score === 6) this.game.score++;
    else if (this.player.facingRight === -1 && this.game.trainingMode && this.game.score === 7) this.game.score++;
    for (let i = 0; i < this.game.enemies.length; i++) {
      if (this.game.enemies[i].inShortRange === 1 && this.player.facingRight === 1) {
        this.game.enemies[i].setState(2);
      } else if (this.game.enemies[i].inShortRange === -1 && this.player.facingRight === -1) {
        this.game.enemies[i].setState(2);
      }
    }
  }
  handleInput(inputKeys) {
    if (this.player.frameX === this.player.maxFrame) this.player.setState(states.STANDING);
  }
}

export class Attack3 extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 18;
    this.player.frameY = 11;
    this.player.speed = 0;
    this.game.energy -= 30;
    if (this.player.facingRight === 1 && this.game.trainingMode && this.game.score === 8) this.game.score++;
    else if (this.player.facingRight === -1 && this.game.trainingMode && this.game.score === 9) this.game.score++;
    for (let i = 0; i < this.game.enemies.length; i++) {
      if (this.game.enemies[i].inShortRange === 1 && this.player.facingRight === 1) {
        this.game.enemies[i].setState(2);
      } else if (this.game.enemies[i].inShortRange === -1 && this.player.facingRight === -1) {
        this.game.enemies[i].setState(2);
      }
    }
  }
  handleInput(inputKeys) {
    if (this.player.frameX === this.player.maxFrame) {
      for (let i = 0; i < this.game.enemies.length; i++) {
        if (this.game.enemies[i].inLongRange === 1 && this.player.facingRight === 1) {
          this.game.enemies[i].setState(2);
        } else if (this.game.enemies[i].inLongRange === -1 && this.player.facingRight === -1) {
          this.game.enemies[i].setState(2);
        }
      }
      this.player.setState(states.STANDING);
    }
  }
}

export class Seppaku extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 19;
    this.player.frameY = 15;
    this.player.speed = 0;
  }
  handleInput() {
    if (this.player.frameX >= 11 && this.player.frameX <= 13) {
      for (let i = 0; i < 10; i++) {
        this.game.particles.unshift(new PlayerBlood(this.game, this.player.x + (this.player.width / 2), this.game.height - ((this.player.y + this.player.yContactMargin) / 2), -1));
      }
    }
  }
}

export class Transcending extends State {
  constructor(player) {
    super(player);
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 19;
    this.player.frameY = 16;
    this.player.speed = 0;
  }
  handleInput() {

  }
}