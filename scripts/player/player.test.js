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
    mockContext = { drawImage: jest.fn() };

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
    expect(player).toHaveProperty('speed');
    expect(player).toHaveProperty('maxSpeed');
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

  test('.update should update frameX when update is called with enough deltaTime', () => {
    player.update(100);
    // Since 100ms is less than frameInterval, frameX should not change
    expect(player.frameX).toBe(0);
    // Simulate enough time passing for the frame to update
    player.update(1000);
    expect(player.frameX).toBe(1);
  });

  test('.update should reset frameX when maxFrame reached', () => {
    player.frameX = player.maxFrame;
    player.frameTimer = player.frameInterval;
    player.update(1000);
    expect(player.frameX).toBe(0);
  });

  test('.setState should transition to the correct state', () => {
    player.setState(1);
    expect(player.currentState).toBeInstanceOf(Running);
    expect(player.currentState).toBe(player.states[1]);
    expect(player.frameY).toBe(1);
  });

  test('.draw should call context.drawImage correctly', () => {
    player.image = mockImage;
    player.draw(mockContext);
    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, player.frameX * player.spriteWidth, player.frameY * player.spriteHeight, player.spriteWidth, player.spriteHeight, player.x, player.y, player.width, player.height);
  });
});