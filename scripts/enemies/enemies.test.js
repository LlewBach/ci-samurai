import { Zombie1, Zombie2 } from './enemies.js';
import { Walking } from '../enemy-states/enemy-states.js';

describe('Zombie class', () => {
  let game;
  let zombie1, zombie2;
  let mockContext;
  let mockImage = {};

  beforeEach(() => {
    game = {
      annotateMode: false
    };
    zombie1 = new Zombie1(game, 0);
    zombie2 = new Zombie2(game, 3);
    mockContext = {
      drawImage: jest.fn(),
      save: jest.fn(),
      scale: jest.fn(),
      restore: jest.fn(),
      strokeRect: jest.fn() // might need to delete
    };
  });

  test('should create an instances of Zombie', () => {
    expect(zombie1).toBeInstanceOf(Zombie1);
    expect(zombie2).toBeInstanceOf(Zombie2);
  });

  test('should contain necessary keys', () => {
    expect(zombie1).toHaveProperty('game');
    expect(zombie1).toHaveProperty('image');
    expect(zombie1).toHaveProperty('spriteWidth');
    expect(zombie1).toHaveProperty('spriteHeight');
    expect(zombie1).toHaveProperty('width');
    expect(zombie1).toHaveProperty('height');
    expect(zombie1).toHaveProperty('x');
    expect(zombie1).toHaveProperty('y');
    expect(zombie1).toHaveProperty('hitMargin');
    expect(zombie1).toHaveProperty('yContactMargin');
    expect(zombie1).toHaveProperty('facingRight');
    expect(zombie1).toHaveProperty('inShortRange');
    expect(zombie1).toHaveProperty('inLongRange');
    expect(zombie1).toHaveProperty('attackChoice');
    expect(zombie1).toHaveProperty('jumpAttacking');
    expect(zombie1).toHaveProperty('markedForDeletion');
    expect(zombie1).toHaveProperty('speed');
    expect(zombie1).toHaveProperty('maxSpeed');
    expect(zombie1).toHaveProperty('jumpSpeed');
    expect(zombie1).toHaveProperty('frameX');
    expect(zombie1).toHaveProperty('frameY');
    expect(zombie1).toHaveProperty('maxFrame');
    expect(zombie1).toHaveProperty('fps');
    expect(zombie1).toHaveProperty('frameInterval');
    expect(zombie1).toHaveProperty('frameTimer');
    expect(zombie1).toHaveProperty('states');
    expect(zombie1).toHaveProperty('currentState');
  });

  test('should correctly initialize with the given game dimensions', () => {
    expect(zombie1.x).toBe(game.width);
    expect(zombie2.x).not.toBe(game.width);
    expect(zombie1.y).toBe(game.height - game.groundMargin - zombie1.height);
  });

  test('.update should enact currentState.update()', () => {
    zombie1.currentState.update = jest.fn();
    zombie1.update(16);
    expect(zombie1.currentState.update).toHaveBeenCalled();
  });

  test('.update should update x position', () => {
    zombie1.currentState.update = jest.fn();
    zombie1.x = 100;
    zombie1.speed = 7;
    zombie1.update(16);
    expect(zombie1.x).toBe(93);
  });

  test('.update should increment frameTimer if less than frameInterval', () => {
    zombie1.frameTimer = 16;
    zombie1.update(16);
    expect(zombie1.frameTimer).toBe(32);
  });

  test('.update should reset frameTimer if more than frameInterval', () => {
    zombie1.frameTimer = 60;
    zombie1.update(16);
    expect(zombie1.frameTimer).toBe(0);
  });

  test('.update should update frameX when update is called with enough deltaTime', () => {
    // Since 100ms is less than frameInterval, frameX should not change
    zombie1.frameTimer = 0;
    zombie1.update(16);
    expect(zombie1.frameX).toBe(0);
    // Simulate enough time passing for the frame to update
    zombie1.frameTimer = 50;
    zombie1.update(16);
    expect(zombie1.frameX).toBe(1);
  });

  test('.update should reset frameX when maxFrame reached', () => {
    zombie1.frameX = zombie1.maxFrame;
    zombie1.frameTimer = zombie1.frameInterval;
    zombie1.update(16);
    expect(zombie1.frameX).toBe(0);
  });

  test('.setState should transition to the correct state', () => {
    zombie1.setState(1);
    expect(zombie1.currentState).toBeInstanceOf(Walking);
    expect(zombie1.currentState).toBe(zombie1.states[1]);
    expect(zombie1.frameY).toBe(3);
  });

  test('.draw should call strokeRect context method if game.annotateMode is true', () => {
    zombie1.draw(mockContext);
    expect(mockContext.strokeRect).not.toHaveBeenCalled();
    game.annotateMode = true;
    zombie1.draw(mockContext);
    expect(mockContext.strokeRect).toHaveBeenCalled();
  });

  test('.draw should call context.drawImage correctly', () => {
    zombie1.image = mockImage;
    zombie1.draw(mockContext);
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, zombie1.frameX * zombie1.spriteWidth, zombie1.frameY * zombie1.spriteHeight, zombie1.spriteWidth, zombie1.spriteHeight, zombie1.x * zombie1.facingRight, zombie1.y, zombie1.width * zombie1.facingRight, zombie1.height);
  });
});