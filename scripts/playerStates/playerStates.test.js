import { Standing, Running, Jumping, Falling, Rolling, Attack1 } from './playerStates.js';

const states = {
  STANDING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  ATTACK1: 5,
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

  test('should transition to RUNNING state on ArrowLeft press', () => {
    standingState.handleInput(['ArrowLeft']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to RUNNING state on ArrowRight press', () => {
    standingState.handleInput(['ArrowRight']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to JUMPING state on ArrowUp press', () => {
    standingState.handleInput(['ArrowUp']);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
  });

  test('should correctly transition to ATTACK1 on "a" press or "shift + A"', () => {
    player.facingRight = 1;
    standingState.handleInput(['a']);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK1);
    expect(player.facingRight).toBe(1);
    standingState.handleInput(['Shift', 'A']);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK1);
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
    runningState.handleInput([]);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should set facingRight to -1 and speed to -maxSpeed on ArrowLeft press', () => {
    runningState.handleInput(['ArrowLeft']);
    expect(player.facingRight).toBe(-1);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should set facingRight to 1 and speed to +maxSpeed on ArrowRight press', () => {
    runningState.handleInput(['ArrowRight']);
    expect(player.facingRight).toBe(1);
    expect(player.speed).toBe(player.maxSpeed);
  });

  test('should transition to JUMPING state on ArrowUp press', () => {
    runningState.handleInput(['ArrowUp']);
    expect(player.setState).toHaveBeenCalledWith(states.JUMPING);
  });

  test('should transition to ATTACK1 on "a" key press', () => {
    runningState.handleInput(['a']);
    expect(player.setState).toHaveBeenCalledWith(states.ATTACK1);
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
    fallingState.handleInput([]);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should transition to RUNNING if player.onGround() and a horizontal arrow pressed', () => {
    player.onGround.mockReturnValue(true);
    fallingState.handleInput(['ArrowRight']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });

  test('should transition to ROLLING if player.onGround() and ArrowDown is pressed', () => {
    player.onGround.mockReturnValue(true);
    fallingState.handleInput(['ArrowDown']);
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
    // rollingState.enter();
    expect(player.maxFrame).toBe(7);
    expect(player.frameY).toBe(6);
  });

  test('should change player.speed from 0 if landing vertically', () => {
    player.speed = 0;
    rollingState.handleInput(['ArrowLeft']);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should transition to STANDING if frameX === maxFrame && no horizontal arrow pressed', () => {
    // rollingState.enter();
    player.frameX = player.maxFrame - 1;
    rollingState.handleInput([]);
    expect(player.setState).not.toHaveBeenCalled();
    player.frameX = player.maxFrame;
    rollingState.handleInput([]);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should transition to RUNNING if frameX === maxFrame && a horizontal arrow pressed', () => {
    // rollingState.enter();
    player.frameX = player.maxFrame;
    rollingState.handleInput(['ArrowRight']);
    expect(player.setState).toHaveBeenCalledWith(states.RUNNING);
  });
});

describe('Attack1 State', () => {
  let attack1State, game;

  beforeEach(() => {
    game = {
      enemies: [
        { inShortRange: 0, markedForDeletion: false },
        { inShortRange: 1, markedForDeletion: false },
        { inShortRange: -1, markedForDeletion: false }
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

  test('.enter should set enemy.markedForDeletion based on enemy.inShortRange status and player.facingRight', () => {
    expect(game.enemies[1].markedForDeletion).toBe(true);
    player.facingRight = -1;
    attack1State.enter();
    expect(game.enemies[2].markedForDeletion).toBe(true);
  });

  test('should transition to STANDING if frameX === maxFrame', () => {
    player.frameX = 6;
    attack1State.handleInput();
    expect(player.setState).not.toHaveBeenCalled();
    player.frameX = 7;
    attack1State.handleInput();
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });
});
