import { Game } from './main.js';

describe('Game class', () => {
  test('should create an instance of Game', () => {
    const game = new Game(800, 600);
    expect(game).toBeInstanceOf(Game);
  });

  test('should contain necessary keys', () => {
    const game = new Game(800, 600);
    expect(game).toHaveProperty('width');
    expect(game).toHaveProperty('height');
  });

  test('should correctly assign width and height', () => {
    const width = 800;
    const height = 600;
    const game = new Game(width, height);

    expect(game.width).toBe(width);
    expect(game.height).toBe(height);
  });
});