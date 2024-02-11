import { Standing } from './enemyStates.js';

const states = {
  STANDING: 0,
}

let game, enemy;

beforeEach(() => {
  game = {
    speed: 0,
  };

  enemy = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    // maxSpeed: 7,
    // setState: jest.fn(),
  };
});

afterEach(() => {
  enemy = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    // maxSpeed: 7,
    // setState: jest.fn(),
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
});