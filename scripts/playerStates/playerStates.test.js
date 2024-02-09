import { Standing, Running } from './playerStates.js';

const states = {
  STANDING: 0,
  RUNNING: 1,
}

describe('Standing State', () => {
  let player;
  let standingState;

  beforeEach(() => {
    player = {
      frameX: undefined,
      maxFrame: undefined,
      frameY: undefined,
      speed: undefined,
      setState: jest.fn(),
    };
    standingState = new Standing(player);
  });

  test('should set initial frameX to 0 on state instantiation', () => {
    expect(player.frameX).toBe(0);
  });

  test('should configure player properties on .enter()', () => {
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
});

describe('Running State', () => {
  let player;
  let runningState;

  beforeEach(() => {
    player = {
      frameX: undefined,
      maxFrame: undefined,
      frameY: undefined,
      speed: undefined,
      maxSpeed: 7,
      setState: jest.fn(),
    };
    runningState = new Running(player);
  });

  test('should update maxFrame value on .enter()', () => {
    runningState.enter();
    expect(player.maxFrame).toBe(7);
    expect(player.frameY).toBe(1);
  });

  test('should transition to STANDING state on no arrow key press', () => {
    runningState.handleInput([]);
    expect(player.setState).toHaveBeenCalledWith(states.STANDING);
  });

  test('should set speed to -maxSpeed on ArrowLeft press', () => {
    runningState.handleInput(['ArrowLeft']);
    expect(player.speed).toBe(-player.maxSpeed);
  });

  test('should set speed to maxSpeed on ArrowRight press', () => {
    runningState.handleInput(['ArrowRight']);
    expect(player.speed).toBe(player.maxSpeed);
  });
});

