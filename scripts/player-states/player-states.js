import { PlayerBlood } from '../particles/particles.js';
import { FloatingText } from '../floating-text/floating-text.js';

// I learned this state design patter from the JavaScript Game Dev course by Franks Laboratory, credited in the README. The implementation is entirely my own.

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
  ATTACK4: 11,
  DEMON: 12
};

class State {
  constructor(player) {
    this.player = player;
  }
}

export class Standing extends State {
  constructor(player) {
    super(player);
  }
  // State class enter methods are called when a state change is initiated.
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 9;
    this.player.frameY = 0;
    this.player.facingRight = 1;
    this.player.speed = 0;
  }
  // State class handleInput methods determine how the state will react to stimuli.
  handleInput(inputKeys, joystickKeys, controlPadKeys) {
    // Transition to Running (left)
    if (inputKeys.includes('ArrowLeft') || joystickKeys.includes('ArrowLeft')) {
      this.player.setState(states.RUNNING);
      // Transition to Running (right)
    } else if (inputKeys.includes('ArrowRight') || joystickKeys.includes('ArrowRight')) {
      this.player.setState(states.RUNNING);
      // Transition to Jumping
    } else if (inputKeys.includes('ArrowUp') || joystickKeys.includes('ArrowUp')) {
      this.player.setState(states.JUMPING);
      // Transition to Attack1
    } else if ((inputKeys.includes('a') || inputKeys.includes('A') || controlPadKeys.includes('a')) && this.player.game.energy >= 1) {
      // In Standing state, need to specify direction
      if (inputKeys.includes('Shift') || joystickKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK1);
      // Transition to Attack2
    } else if ((inputKeys.includes('s') || inputKeys.includes('S') || controlPadKeys.includes('s')) && this.player.game.energy >= 5) {
      if (inputKeys.includes('Shift') || joystickKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK2);
      // Transition to Attack3
    } else if ((inputKeys.includes('d') || inputKeys.includes('D') || controlPadKeys.includes('d')) && this.player.game.energy >= 30) {
      if (inputKeys.includes('Shift') || joystickKeys.includes('Shift')) this.player.facingRight = -1;
      this.player.setState(states.ATTACK3);
      // Transition to Attack4
    } else if ((inputKeys.includes('f') || inputKeys.includes('F') || controlPadKeys.includes('f')) && this.player.game.energy >= 50) {
      this.player.setState(states.ATTACK4);
    } else if (this.player.game.trainingMode && this.player.game.score === 11) {
      // Transition to Transcending
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
      // Training mode level test
      if (this.player.game.trainingMode && this.player.game.score === 3) this.player.game.score++;
    } else if ((inputKeys.includes('ArrowRight') || joystickKeys.includes('ArrowRight')) && !inputKeys.includes('ArrowLeft')) {
      this.player.facingRight = 1;
      this.player.speed = this.player.maxSpeed;
      // Training mode level test
      if (this.player.game.trainingMode && this.player.game.score === 2) this.player.game.score++;
    }
    // ArrowUp pressed
    if (inputKeys.includes('ArrowUp') || joystickKeys.includes('ArrowUp')) this.player.setState(states.JUMPING);
    // Attack buttons
    else if ((inputKeys.includes('a') || inputKeys.includes('A') || controlPadKeys.includes('a')) && this.player.game.energy >= 1) this.player.setState(states.ATTACK1);
    else if ((inputKeys.includes('s') || inputKeys.includes('S') || controlPadKeys.includes('s')) && this.player.game.energy >= 5) this.player.setState(states.ATTACK2);
    else if ((inputKeys.includes('d') || inputKeys.includes('D') || controlPadKeys.includes('d')) && this.player.game.energy >= 30) this.player.setState(states.ATTACK3);
    else if ((inputKeys.includes('f') || inputKeys.includes('F') || controlPadKeys.includes('f')) && this.player.game.energy >= 50) this.player.setState(states.ATTACK4);
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
    // Training mode level test
    if (this.player.game.trainingMode && this.player.game.score === 0) this.player.game.score++;
  }
  handleInput() {
    // Transition to Falling
    if (this.player.vy >= 0) this.player.setState(states.FALLING);
  }
}

export class Falling extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 2;
    this.player.frameY = 3;
    // Increases energy by 1
    if (this.player.game.energy < 100) this.player.game.energy++;
    this.game.floatingText.push(new FloatingText('+1', (this.player.x + this.player.width) / 2, this.player.y + this.player.height, 380, 50));
  }
  handleInput(inputKeys, joystickKeys) {
    // Transition to Rolling
    if (this.player.onGround() && (inputKeys.includes('ArrowDown') || joystickKeys.includes('ArrowDown'))) this.player.setState(states.ROLLING);
    // Transition to Running
    else if (this.player.onGround() && (inputKeys.includes('ArrowRight') || inputKeys.includes('ArrowLeft'))) this.player.setState(states.RUNNING);
    // Transition to Standing
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
    // Training mode level test
    if (this.player.game.trainingMode && this.player.game.score === 1) this.player.game.score++;
  }
  handleInput(inputKeys, joystickKeys) {
    // Determines direction of roll if no horizontal movement.
    if (this.player.speed === 0) {
      if (inputKeys.includes('ArrowLeft') || joystickKeys.includes('ArrowLeft')) {
        this.player.facingRight = -1;
        this.player.speed = -this.player.maxSpeed;
      } else {
        this.player.speed = this.player.maxSpeed;
      }
    }
    // This prevents cheating death bug by rolling out of attack
    if (this.player.frameX === this.player.maxFrame && this.player.game.health === 0) this.player.setState(states.SEPPAKU);
    // Transition to Standing
    else if (this.player.frameX === this.player.maxFrame && (!inputKeys.includes('ArrowLeft') && !inputKeys.includes('ArrowRight') && !joystickKeys.includes('ArrowLeft') && !joystickKeys.includes('ArrowRight'))) this.player.setState(states.STANDING);
    // Transition to Running
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
    // Following state transitions allow escape, by jumping or rolling.
    if ((inputKeys.includes('ArrowUp') && this.player.onGround()) || joystickKeys.includes('ArrowUp') && this.player.onGround()) this.player.setState(states.JUMPING);
    else if ((inputKeys.includes('ArrowDown') && this.player.onGround()) || joystickKeys.includes('ArrowDown') && this.player.onGround()) this.player.setState(states.ROLLING);
    // Transition to Seppaku if health reaches 0.
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
    // Energy cost
    this.game.energy--;
    // Training mode level tests
    if (this.player.facingRight === 1 && this.game.trainingMode && this.game.score === 4) this.game.score++;
    else if (this.player.facingRight === -1 && this.game.trainingMode && this.game.score === 5) this.game.score++;
    // Checks which enemies currently have an inShortRange value that corresponds with players current facing direction.
    for (let i = 0; i < this.game.enemies.length; i++) {
      if (this.game.enemies[i].inShortRange === 1 && this.player.facingRight === 1) {
        // Transitions qualifying enemies to Dying state
        this.game.enemies[i].setState(2);
        // Breaking here limits number of enemies killed to 1.
        break;
      } else if (this.game.enemies[i].inShortRange === -1 && this.player.facingRight === -1) {
        this.game.enemies[i].setState(2);
        break;
      }
    }
  }
  handleInput(inputKeys) {
    // Once full animation sequence played out, transition to Standing.
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
    // Energy cost
    this.game.energy -= 5;
    // Training mode level tests
    if (this.player.facingRight === 1 && this.game.trainingMode && this.game.score === 6) this.game.score++;
    else if (this.player.facingRight === -1 && this.game.trainingMode && this.game.score === 7) this.game.score++;
    for (let i = 0; i < this.game.enemies.length; i++) {
      if (this.game.enemies[i].inShortRange === 1 && this.player.facingRight === 1) {
        this.game.enemies[i].setState(2);
        // The lack of break command here ensures all qualifying enemies killed.
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
    this.player.frameX = 9;
    this.player.maxFrame = 18;
    this.player.frameY = 11;
    this.player.speed = 0;
    // Energy cost
    this.game.energy -= 30;
    // Health reward
    this.game.health += 5;
    // Initiates floating message
    this.game.floatingText.push(new FloatingText('+5', (this.player.x + this.player.width) / 2, this.player.y + this.player.height, 650, 50));
    // Training mode level tests
    if (this.player.facingRight === 1 && this.game.trainingMode && this.game.score === 8) this.game.score++;
    else if (this.player.facingRight === -1 && this.game.trainingMode && this.game.score === 9) {
      this.game.score++;
      // Ensures that the next training mode level has the requisite energy.
      this.game.energy = 50;
    }
  }
  handleInput(inputKeys) {
    // Kills all enemies in long-range on correct side, once attack sequence done
    if (this.player.frameX === this.player.maxFrame) {
      for (let i = 0; i < this.game.enemies.length; i++) {
        if (this.game.enemies[i].inLongRange === 1 && this.player.facingRight === 1) {
          this.game.enemies[i].setState(2);
        } else if (this.game.enemies[i].inLongRange === -1 && this.player.facingRight === -1) {
          this.game.enemies[i].setState(2);
        }
      }
      // Transition to Standing once attack done.
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
    // Initiates blood particles for frames where sword in player body
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
  // Even though it's empty, this function is necessary because the player object expects every state to have a handleInput method.
  handleInput() {

  }
}

export class Attack4 extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 19;
    this.player.frameY = 12;
    this.player.speed = 0;
    // Energy cost
    this.game.energy -= 50;
    // Health reward
    this.game.health += 25;
    // Initiates floating message
    this.game.floatingText.push(new FloatingText('+25', (this.player.x + this.player.width) / 2, this.player.y + this.player.height, 650, 50));
    // Training mode level test
    if (this.game.trainingMode && this.game.score === 10) this.game.score++;
  }
  handleInput(inputKeys) {
    // Kills all enemies in long-range on both sides, once attack sequence done.
    if (this.player.frameX === this.player.maxFrame) {
      for (let i = 0; i < this.game.enemies.length; i++) {
        if (this.game.enemies[i].inLongRange === 1 || this.game.enemies[i].inLongRange === -1) {
          this.game.enemies[i].setState(2);
        }
      }
      // Transition to Standing
      this.player.setState(states.STANDING);
    }
  }
}

export class Demon extends State {
  constructor(player, game) {
    super(player);
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 43;
    this.player.frameY = 17;
    this.player.speed = 0;
  }
  handleInput(inputKeys) {
    if (this.player.frameY === 17) {
      for (let i = 0; i < this.game.enemies.length; i++) {
        this.game.enemies[i].setState(2);
      }
    }
    // Moves sprite sheet animation to next line
    if (this.player.frameX === this.player.maxFrame && this.player.frameY === 17) this.player.frameY++;
    // Keeps player in standing animation sequence
    else if (this.player.frameY === 18 && this.player.frameX === 8) this.player.frameX = 0;
  }
}
