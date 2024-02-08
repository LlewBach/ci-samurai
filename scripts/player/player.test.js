import { Game } from '../main/main.js';
import { Player } from './player.js';

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
    expect(player).toHaveProperty('image');
    expect(player).toHaveProperty('spriteWidth');
    expect(player).toHaveProperty('spriteHeight');
    expect(player).toHaveProperty('width');
    expect(player).toHaveProperty('height');
    expect(player).toHaveProperty('x');
    expect(player).toHaveProperty('y');
    expect(player).toHaveProperty('frameX');
    expect(player).toHaveProperty('frameY');
    expect(player).toHaveProperty('maxFrame');
    expect(player).toHaveProperty('fps');
    expect(player).toHaveProperty('frameInterval');
    expect(player).toHaveProperty('frameTimer');
  });

  test('should correctly initialize with the given game dimensions', () => {
    expect(player.x).toBe((game.width - player.width) / 2);
    expect(player.y).toBe(game.height - player.height);
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

  test('.draw should call context.drawImage correctly', () => {
    player.image = mockImage;
    player.draw(mockContext);
    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, player.frameX * player.spriteWidth, player.frameY * player.spriteHeight, player.spriteWidth, player.spriteHeight, player.x, player.y, player.width, player.height);
  });
});