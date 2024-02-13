import { Standing, Walking, Dying } from './enemyStates.js';

const states = {
  STANDING: 0,
  WALKING: 1,
  DYING: 2,
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
    markedForDeletion: false,
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
    markedForDeletion: false,
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

describe('Dying state', () => {
  let dyingState;

  beforeEach(() => {
    dyingState = new Dying(game, enemy);
  });

  test('should configure some enemy properties on .enter()', () => {
    dyingState.enter();
    expect(enemy.frameX).toBe(10);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(10);
  });

  test('should modify the standard animate algorithm', () => {
    dyingState.enter();
    enemy.frameX = 11;
    dyingState.update();
    expect(enemy.frameX).toBe(0);
    enemy.frameX = 3;
    dyingState.update();
    expect(enemy.markedForDeletion).toBe(true);
  });
});