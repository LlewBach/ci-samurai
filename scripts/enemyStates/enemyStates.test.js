import { Standing, Walking } from './enemyStates.js';

const states = {
  STANDING: 0,
  WALKING: 1,
}

let game, enemy;

beforeEach(() => {
  game = {
    width: 500,
    speed: 0,
  };

  enemy = {
    width: 50,
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 1,
    setState: jest.fn(),
  };
});

afterEach(() => {
  enemy = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 1,
    setState: jest.fn(),
  };
});

describe('Standing state', () => {
  let standingState;

  beforeEach(() => {
    standingState = new Standing(game, enemy);
  });

  test('should configure some enemy properties on .enter()', () => {
    standingState.enter();
    expect(enemy.frameX).toBe(0);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(2);
  });

  test('.update should update enemy.speed', () => {
    expect(game.speed).toBe(0);
    game.speed = 7;
    standingState.update();
    expect(enemy.speed).toBe(7);
  });

  test('should transition to WALKING based on enemy.x', () => {
    enemy.x = 440;
    standingState.update();
    expect(enemy.setState).toHaveBeenCalled();
  });
});

describe('Walking state', () => {
  let walkingState;

  beforeEach(() => {
    walkingState = new Walking(game, enemy);
  });

  test('should configure some enemy properties on .enter()', () => {
    walkingState.enter();
    expect(enemy.frameX).toBe(0);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(3);
  });

  test('.update should update enemy.speed', () => {
    expect(game.speed).toBe(0);
    game.speed = 7;
    walkingState.update();
    expect(enemy.speed).toBe(8);
  });
});