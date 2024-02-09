import { Standing, Running, Jumping, Falling } from './playerStates.js';

const states = {
  STANDING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
}
let player;

beforeEach(() => {
  player = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 7,
    setState: jest.fn(),
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

  test('should set initial frameX to 0 on state instantiation', () => {
    expect(player.frameX).toBe(0);
  });

  test('should configure some player properties on .enter()', () => {
    standingState.enter();
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
});

describe('Jumping State', () => {
  let jumpingState;

  beforeEach(() => {
    jumpingState = new Jumping(player);
  });

  test('should configure some player properties on .enter()', () => {
    jumpingState.enter();
    expect(player.maxFrame).toBe(2);
    expect(player.frameY).toBe(2);
    expect(player.vy).toBe(-24);
  });

  test('should transition to FALLING state at jump peak', () => {
    jumpingState.enter();
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
  });

  test('should configure some player properties on .enter()', () => {
    fallingState.enter();
    expect(player.maxFrame).toBe(2);
    expect(player.frameY).toBe(3);
  });
});

