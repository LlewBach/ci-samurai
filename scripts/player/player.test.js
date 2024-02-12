import { Game } from '../main/main.js';
import { Player } from './player.js';
import { Standing, Running } from '../playerStates/playerStates.js';

describe('Player class', () => {
  let game;
  let player;
  let mockContext;
  let mockImage = {};

  beforeEach(() => {
    game = new Game(800, 600);
    player = new Player(game);
    mockContext = {
      drawImage: jest.fn(),
      save: jest.fn(),
      scale: jest.fn(),
      restore: jest.fn(),
      strokeRect: jest.fn() // might need to delete
    };

  });

  test('should create an instance of Player', () => {
    expect(player).toBeInstanceOf(Player);
  });

  test('should contain necessary keys', () => {
    expect(player).toHaveProperty('game');
    expect(player).toHaveProperty('image');
    expect(player).toHaveProperty('spriteWidth');
    expect(player).toHaveProperty('spriteHeight');
    expect(player).toHaveProperty('width');
    expect(player).toHaveProperty('height');
    expect(player).toHaveProperty('x');
    expect(player).toHaveProperty('y');
    expect(player).toHaveProperty('facingRight');
    expect(player).toHaveProperty('speed');
    expect(player).toHaveProperty('maxSpeed');
    expect(player).toHaveProperty('vy');
    expect(player).toHaveProperty('gravity');
    expect(player).toHaveProperty('frameX');
    expect(player).toHaveProperty('frameY');
    expect(player).toHaveProperty('maxFrame');
    expect(player).toHaveProperty('fps');
    expect(player).toHaveProperty('frameInterval');
    expect(player).toHaveProperty('frameTimer');
    expect(player).toHaveProperty('states');
    expect(player).toHaveProperty('currentState');
  });

  test('should correctly initialize with the given game dimensions', () => {
    expect(player.x).toBe((game.width - player.width) / 2);
    expect(player.y).toBe(game.height - game.groundMargin - player.height);
  });

  test('should start in the Standing state', () => {
    expect(player.currentState).toBeInstanceOf(Standing);
    expect(player.currentState).toBe(player.states[0]);
    expect(player.frameY).toBe(0);
    expect(player.speed).toBe(0);
  });

  test('.update should call shortRangeCheck()', () => {
    const shortRangeCheckSpy = jest.spyOn(player, 'shortRangeCheck');
    player.update(16);
    expect(shortRangeCheckSpy).toHaveBeenCalled();
  });

  test('.update should enact currentState.handleInput()', () => {
    player.currentState.handleInput = jest.fn();
    player.update(16);
    expect(player.currentState.handleInput).toHaveBeenCalled();
  });

  test('.update should set game.speed to current player.speed', () => {
    player.speed = player.maxSpeed;
    player.update(16);
    expect(game.speed).toBe(player.speed);
  });

  test('.update should update player.y based on player.vy', () => {
    player.y = 100;
    player.vy = -24;
    player.update(16);
    expect(player.y).toBe(76);
  });

  test('.update should update player.vy based on player.gravity', () => {
    player.vy = -24;
    player.update(16);
    expect(player.vy).toBe(-24 + player.gravity);
  });

  test('.update should enforce the ground boundary', () => {
    player.vy = 20;
    player.y = game.height - game.groundMargin - player.height;
    player.update(16);
    expect(player.vy).toBe(0);
  });

  test('.update should increment frameTimer if less than frameInterval', () => {
    player.frameTimer = 16;
    player.update(16);
    expect(player.frameTimer).toBe(32);
  });

  test('.update should reset frameTimer if more than frameInterval', () => {
    player.frameTimer = 60;
    player.update(16);
    expect(player.frameTimer).toBe(0);
  });

  test('.update should update frameX when update is called with enough deltaTime', () => {
    player.frameTimer = 0;
    player.update(16);
    // Since 100ms is less than frameInterval, frameX should not change
    expect(player.frameX).toBe(0);
    // Simulate enough time passing for the frame to update
    player.frameTimer = 50;
    player.update(16);
    expect(player.frameX).toBe(1);
  });

  test('.update should reset frameX when maxFrame reached', () => {
    player.frameX = player.maxFrame;
    player.frameTimer = player.frameInterval;
    player.update(16);
    expect(player.frameX).toBe(0);
  });

  test('.setState should transition to the correct state', () => {
    player.setState(1);
    expect(player.currentState).toBeInstanceOf(Running);
    expect(player.currentState).toBe(player.states[1]);
    expect(player.frameY).toBe(1);
  });

  test('.onGround should return true if player onGround and false if player in the air', () => {
    expect(player.onGround()).toBe(true);
    player.y = game.height - game.groundMargin - player.height - 20;
    expect(player.onGround()).toBe(false);
  });

  test('.shortRangeCheck should check each enemy to see if player attack range and enemy hit range intersect and on what side', () => {
    game.enemies = [
      {
        x: 100,
        width: 50,
        hitMargin: 10,
        inShortRange: 0
      }, {
        x: 145,
        width: 50,
        hitMargin: 10,
        inShortRange: 0
      }
    ];
    game.enemies.forEach(enemy => {
      expect(enemy.inShortRange).toBe(0);
    });
    player.x = 120;
    player.width = 50;
    player.attackMargin = 10;
    player.shortRangeCheck();
    expect(game.enemies[0].inShortRange).toBe(-1);
    expect(game.enemies[1].inShortRange).toBe(1);
  });

  test('.draw should call context.drawImage correctly', () => {
    player.image = mockImage;
    player.draw(mockContext);
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, player.frameX * player.spriteWidth, player.frameY * player.spriteHeight, player.spriteWidth, player.spriteHeight, player.x * player.facingRight, player.y, player.width * player.facingRight, player.height);
  });
});