import { Standing } from './playerStates.js';

describe('Standing State', () => {
  let player;
  let standingState;

  beforeEach(() => {
    player = {
      frameX: undefined,
      maxFrame: undefined,
      frameY: undefined,
      speed: undefined,
    };
    standingState = new Standing(player);
  });

  test('should set initial frameX to 0 on state instantiation', () => {
    expect(player.frameX).toBe(0);
  });

  test('should configure player properties on enter', () => {
    standingState.enter();
    expect(player.maxFrame).toBe(9);
    expect(player.frameY).toBe(0);
    expect(player.speed).toBe(0);
  });

});

