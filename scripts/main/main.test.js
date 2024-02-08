import { Game } from './main.js';
import { Background } from '../background/background.js';
import { Player } from '../player/player.js';

// Mock dependencies
jest.mock('../background/background.js');
jest.mock('../player/player.js');

describe('Game class', () => {
  let game;
  let mockContext;

  beforeEach(() => {
    jest.clearAllMocks();
    game = new Game(800, 600);
  });

  test('should create an instance of Game', () => {
    expect(game).toBeInstanceOf(Game);
    expect(game.width).toBe(800);
    expect(game.height).toBe(600);
  });

  test('should contain necessary keys', () => {
    expect(game).toHaveProperty('width');
    expect(game).toHaveProperty('height');
    expect(game).toHaveProperty('speed');
    expect(game).toHaveProperty('background');
    expect(game).toHaveProperty('player');
  });

  test('should initialize with Background and Player instances', () => {
    expect(game.background).toBeInstanceOf(Background);
    expect(game.player).toBeInstanceOf(Player);
    expect(Background).toHaveBeenCalledWith(game);
    expect(Player).toHaveBeenCalledWith(game);
  });

  test('.update should call update on both Background and Player', () => {
    const deltaTime = 16; // The average value
    game.update(deltaTime);
    expect(game.background.update).toHaveBeenCalled();
    expect(game.player.update).toHaveBeenCalledWith(deltaTime);
  });

  test('.draw should call draw on both Background and Player', () => {
    mockContext = { drawImage: jest.fn() };
    game.background.draw = jest.fn();
    game.player.draw = jest.fn();
    game.draw(mockContext);

    expect(game.background.draw).toHaveBeenCalledWith(mockContext);
    expect(game.player.draw).toHaveBeenCalledWith(mockContext);
  });
});