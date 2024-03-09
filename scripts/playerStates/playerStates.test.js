import { Standing, Running, Jumping, Falling, Rolling, Stun, Attack1, Attack2, Attack3, Seppaku, Transcending } from './playerStates.js';
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
let player;

beforeEach(() => { //Change to beforeAll?
  player = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 7,
    setState: jest.fn(),
    onGround: jest.fn(),
  };
});

afterEach(() => {
  player = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 7,
    setState: jest.fn(),
    onGround: jest.fn(),
  };
});

describe('Standing State', () => {
  let standingState;

  beforeEach(() => {
    standingState = new Standing(player);
  });

  test('should configure some player properties on .enter()', () => {
    standingState.enter();
    expect(player.frameX).toBe(0);
    expect(player.maxFrame).toBe(9);
    expect(player.frameY).toBe(0);
    expect(player.speed).toBe(0);
  });

  test('should transition to RUNNING state on ArrowLeft key press', () => {
    standingState.handleInput(['ArrowLeft'], []);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to RUNNING state on ArrowLeft joystick move', () => {
    standingState.handleInput([], ['ArrowLeft']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to RUNNING state on ArrowRight key press', () => {
    standingState.handleInput(['ArrowRight'], []);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to RUNNING state on ArrowRight joystick move', () => {
    standingState.handleInput([], ['ArrowRight']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to JUMPING state on ArrowUp key press', () => {
    standingState.handleInput(['ArrowUp'], []);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
  });

  test('should transition to JUMPING state on ArrowUp joystick move', () => {
    standingState.handleInput([], ['ArrowUp']);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
  });

  test('should correctly transition to ATTACK1 on "a" press or "shift + A"', () => {
    player.facingRight = 1;
    standingState.handleInput(['a'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK1);
    expect(player.facingRight).toBe(1);
    standingState.handleInput(['Shift', 'A'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK1);
    expect(player.facingRight).toBe(-1);
  });

  test('should correctly transition to ATTACK2 on "s" press or "shift + S"', () => {
    player.facingRight = 1;
    standingState.handleInput(['s'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK2);
    expect(player.facingRight).toBe(1);
    standingState.handleInput(['Shift', 'S'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK2);
    expect(player.facingRight).toBe(-1);
  });

  test('should correctly transition to ATTACK3 on "d" press or "shift + D"', () => {
    player.facingRight = 1;
    standingState.handleInput(['d'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK3);
    expect(player.facingRight).toBe(1);
    standingState.handleInput(['Shift', 'D'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK3);
    expect(player.facingRight).toBe(-1);
  });
});

describe('Running State', () => {
  let runningState;

  beforeEach(() => {
    runningState = new Running(player);
  });

  test('should configure some player properties on .enter()', () => {
    runningState.enter();
    expect(player.maxFrame).toBe(7);
    expect(player.frameY).toBe(1);
  });

  test('should transition to STANDING state on no arrow key press', () => {
    runningState.handleInput([], []);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should set facingRight to -1 and speed to -maxSpeed on ArrowLeft key press', () => {
    runningState.handleInput(['ArrowLeft'], []);
    expect(player.facingRight).toBe(-1);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should set facingRight to -1 and speed to -maxSpeed on ArrowLeft joystick move', () => {
    runningState.handleInput([], ['ArrowLeft']);
    expect(player.facingRight).toBe(-1);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should set facingRight to 1 and speed to +maxSpeed on ArrowRight key press', () => {
    runningState.handleInput(['ArrowRight'], []);
    expect(player.facingRight).toBe(1);
    expect(player.speed).toBe(player.maxSpeed);
  });

  test('should set facingRight to 1 and speed to +maxSpeed on ArrowRight joystick move', () => {
    runningState.handleInput([], ['ArrowRight']);
    expect(player.facingRight).toBe(1);
    expect(player.speed).toBe(player.maxSpeed);
  });

  test('should transition to JUMPING state on ArrowUp key press', () => {
    runningState.handleInput(['ArrowUp'], []);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
  });

  test('should transition to JUMPING state on ArrowUp joystick move', () => {
    runningState.handleInput([], ['ArrowUp']);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
  });

  test('should transition to ATTACK1 on "a" key press', () => {
    runningState.handleInput(['a'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK1);
  });

  test('should transition to ATTACK2 on "s" key press', () => {
    runningState.handleInput(['s'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK2);
  });

  test('should transition to ATTACK3 on "d" key press', () => {
    runningState.handleInput(['d'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK3);
  });
});

describe('Jumping State', () => {
  let jumpingState;

  beforeEach(() => {
    jumpingState = new Jumping(player);
    jumpingState.enter();
  });

  test('should configure some player properties on .enter()', () => {
    // jumpingState.enter();
    expect(player.maxFrame).toBe(2);
    expect(player.frameY).toBe(2);
    expect(player.vy).toBe(-24);
  });

  test('should transition to FALLING state at jump peak', () => {
    // jumpingState.enter();
    player.vy = -1;
    jumpingState.handleInput();
    expect(player.setState).not.toHaveBeenCalledWith(states.FALLING);
    expect(player.frameY).toBe(2);
    player.vy = 0;
    jumpingState.handleInput();
    expect(player.setState).toHaveBeenCalledWith(states.FALLING);
  });
});

describe('Falling State', () => {
  let fallingState;

  beforeEach(() => {
    fallingState = new Falling(player);
    fallingState.enter();
  });

  test('should configure some player properties on .enter()', () => {
    // fallingState.enter();
    expect(player.maxFrame).toBe(2);
    expect(player.frameY).toBe(3);
  });

  test('should transition to STANDING if player.onGround() and no horizontal arrow pressed', () => {
    player.onGround.mockReturnValue(true);
    fallingState.handleInput([], []);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should transition to RUNNING if player.onGround() and a horizontal arrow pressed', () => {
    player.onGround.mockReturnValue(true);
    fallingState.handleInput(['ArrowRight'], []);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to ROLLING if player.onGround() and ArrowDown key is pressed', () => {
    player.onGround.mockReturnValue(true);
    fallingState.handleInput(['ArrowDown'], []);
    expect(player.setState).toHaveBeenCalledWith(states.ROLLING);
  });

  test('should transition to ROLLING if player.onGround() and ArrowDown joystick move', () => {
    player.onGround.mockReturnValue(true);
    fallingState.handleInput([], ['ArrowDown']);
    expect(player.setState).toHaveBeenCalledWith(states.ROLLING);
  });
});

describe('Rolling State', () => {
  let rollingState;

  beforeEach(() => {
    rollingState = new Rolling(player);
    rollingState.enter();
  });

  test('should configure some player properties on .enter()', () => {
    expect(player.maxFrame).toBe(7);
    expect(player.frameY).toBe(6);
  });

  test('should roll left if landing straight down and ArrowLeft key pressed', () => {
    player.speed = 0;
    rollingState.handleInput(['ArrowLeft'], []);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should roll left if landing straight down and ArrowLeft joystick move', () => {
    player.speed = 0;
    rollingState.handleInput([], ['ArrowLeft']);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should transition to STANDING if frameX === maxFrame && no horizontal arrow pressed', () => {
    player.frameX = player.maxFrame - 1;
    rollingState.handleInput([], []);
    expect(player.setState).not.toHaveBeenCalled();
    player.frameX = player.maxFrame;
    rollingState.handleInput([], []);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should transition to RUNNING if frameX === maxFrame && a horizontal arrow key pressed', () => {
    player.frameX = player.maxFrame;
    rollingState.handleInput(['ArrowRight'], []);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to RUNNING if frameX === maxFrame && a horizontal joystick move', () => {
    player.frameX = player.maxFrame;
    rollingState.handleInput([], ['ArrowRight']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });
});

describe('Stun State', () => {
  let stunState, game;

  beforeEach(() => {
    game = {
      gameOver: false
    };
    stunState = new Stun(player, game);
    stunState.enter();
  });

  test('.enter should configure some player properties', () => {
    player.speed = player.maxSpeed;
    jest.spyOn(player, 'onGround').mockReturnValue(true);
    stunState.enter();
    expect(player.maxFrame).toBe(5);
    expect(player.frameY).toBe(14);
    expect(player.speed).toBe(0);
  });

  test('should transition state correctly depending on frameX and onGround status', () => {
    player.frameX = player.maxFrame;
    jest.spyOn(player, 'onGround').mockReturnValue(true);
    stunState.handleInput([]);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
    jest.spyOn(player, 'onGround').mockReturnValue(false);
    stunState.handleInput([]);
    expect(player.setState).toHaveBeenCalledWith(states.FALLING);
    jest.spyOn(player, 'onGround').mockReturnValue(true);
    stunState.handleInput(['ArrowUp']);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
    stunState.handleInput(['ArrowDown']);
    expect(player.setState).toHaveBeenCalledWith(states.ROLLING);
  });

});

describe('Attack1 State', () => {
  let attack1State, game;

  beforeEach(() => {
    game = {
      enemies: [
        { inShortRange: 0, setState: jest.fn() },
        { inShortRange: 1, setState: jest.fn() },
        { inShortRange: -1, setState: jest.fn() },
        { inShortRange: 1, setState: jest.fn() },
      ]
    };
    player.facingRight = 1;
    attack1State = new Attack1(player, game);
    attack1State.enter();
  });

  test('.enter should configure some player properties', () => {
    expect(player.maxFrame).toBe(7);
    expect(player.frameY).toBe(9);
  });

  test('.enter should set change max 1 x enemy state based on enemy.inShortRange status and player.facingRight', () => {
    expect(game.enemies[0].setState).not.toHaveBeenCalled();
    expect(game.enemies[1].setState).toHaveBeenCalled();
    expect(game.enemies[2].setState).not.toHaveBeenCalled();
    expect(game.enemies[3].setState).not.toHaveBeenCalled();
    player.facingRight = -1;
    attack1State.enter();
    expect(game.enemies[2].setState).toHaveBeenCalled();
  });

  test('should transition to STANDING if frameX === maxFrame', () => {
    player.frameX = player.maxFrame - 1;
    attack1State.handleInput();
    expect(player.setState).not.toHaveBeenCalled();
    player.frameX = player.maxFrame;
    attack1State.handleInput();
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });
});

describe('Attack2 State', () => {
  let attack2State, game;

  beforeEach(() => {
    game = {
      enemies: [
        { inShortRange: 0, setState: jest.fn() },
        { inShortRange: 1, setState: jest.fn() },
        { inShortRange: -1, setState: jest.fn() },
        { inShortRange: 1, setState: jest.fn() },
      ]
    };
    player.facingRight = 1;
    attack2State = new Attack2(player, game);
    attack2State.enter();
  });

  test('.enter should configure some player properties', () => {
    expect(player.maxFrame).toBe(9);
    expect(player.frameY).toBe(10);
  });

  test('.enter should set change multiple enemies states based on enemy.inShortRange status and player.facingRight', () => {
    expect(game.enemies[0].setState).not.toHaveBeenCalled();
    expect(game.enemies[1].setState).toHaveBeenCalled();
    expect(game.enemies[2].setState).not.toHaveBeenCalled();
    expect(game.enemies[3].setState).toHaveBeenCalled();
    player.facingRight = -1;
    attack2State.enter();
    expect(game.enemies[2].setState).toHaveBeenCalled();
  });

  test('should transition to STANDING if frameX === maxFrame', () => {
    player.frameX = player.maxFrame - 1;
    attack2State.handleInput();
    expect(player.setState).not.toHaveBeenCalled();
    player.frameX = player.maxFrame;
    attack2State.handleInput();
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });
});

describe('Attack3 State', () => {
  let attack3State, game;

  beforeEach(() => {
    game = {
      enemies: [
        { inShortRange: 0, inLongRange: 0, setState: jest.fn() },
        { inShortRange: 1, inLongRange: 1, setState: jest.fn() },
        { inShortRange: -1, inLongRange: -1, setState: jest.fn() },
        { inShortRange: 1, inLongRange: 1, setState: jest.fn() },
      ]
    };
    player.facingRight = 1;
    attack3State = new Attack3(player, game);
    attack3State.enter();
  });

  test('.enter should configure some player properties', () => {
    expect(player.maxFrame).toBe(18);
    expect(player.frameY).toBe(11);
  });

  test('.enter should set change multiple enemies states based on enemy.inShortRange status and player.facingRight', () => {
    expect(game.enemies[0].setState).not.toHaveBeenCalled();
    expect(game.enemies[1].setState).toHaveBeenCalled();
    expect(game.enemies[2].setState).not.toHaveBeenCalled();
    expect(game.enemies[3].setState).toHaveBeenCalled();
    player.facingRight = -1;
    attack3State.enter();
    expect(game.enemies[2].setState).toHaveBeenCalled();
  });

  test('.handleInput should set change multiple enemies states based on enemy.inLongRange status, player.facingRight and frameX', () => {
    player.frameX = player.maxFrame;
    attack3State.handleInput();
    expect(game.enemies[0].setState).not.toHaveBeenCalled();
    expect(game.enemies[1].setState).toHaveBeenCalled();
    expect(game.enemies[2].setState).not.toHaveBeenCalled();
    expect(game.enemies[3].setState).toHaveBeenCalled();
    player.facingRight = -1;
    attack3State.handleInput();
    expect(game.enemies[2].setState).toHaveBeenCalled();
  });

  test('should transition to STANDING if frameX === maxFrame', () => {
    player.frameX = player.maxFrame - 1;
    attack3State.handleInput();
    expect(player.setState).not.toHaveBeenCalled();
    player.frameX = player.maxFrame;
    attack3State.handleInput();
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });
});

describe('Seppaku state', () => {
  let seppakuState, game;

  beforeEach(() => {
    game = {
      gameOver: true,
      particles: [],
    };
    seppakuState = new Seppaku(player, game);
    seppakuState.enter();
  });

  test('should configure some player properties', () => {
    expect(player.maxFrame).toBe(19);
    expect(player.frameY).toBe(15);
  });

  test('should add particles to game.particles array at certain x frames', () => {
    player.frameX = 8;
    seppakuState.handleInput();
    expect(game.particles.length).toBe(0);
    player.frameX = 13;
    seppakuState.handleInput();
    expect(game.particles.length).toBe(10);
    expect(game.particles[0]).toBeInstanceOf(PlayerBlood);
  });
});

describe('Transcending state', () => {
  let transcendingState, game;

  beforeEach(() => {
    game = { gameOver: true };
    transcendingState = new Transcending(player);
    transcendingState.enter();
  });

  test('should configure some player properties', () => {
    expect(player.maxFrame).toBe(19);
    expect(player.frameY).toBe(16);
  });
});