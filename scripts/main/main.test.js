import { Game } from './main.js';
import { Background } from '../background/background.js';
import { Player } from '../player/player.js';
// import { Zombie1 } from '../enemies/enemies.js';

// Mock dependencies
jest.mock('../background/background.js');
jest.mock('../player/player.js');
// jest.mock('../enemies/enemies.js');

describe('Game class', () => {
  let game;
  let mockContext;

  beforeEach(() => {
    jest.clearAllMocks();
    game = new Game(800, 600);
    game.enemies = [
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: false },
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: true }
    ];
  });

  test('should create an instance of Game', () => {
    expect(game).toBeInstanceOf(Game);
    expect(game.width).toBe(800);
    expect(game.height).toBe(600);
  });

  test('should contain necessary keys', () => {
    expect(game).toHaveProperty('width');
    expect(game).toHaveProperty('height');
    expect(game).toHaveProperty('groundMargin');
    expect(game).toHaveProperty('speed');
    expect(game).toHaveProperty('background');
    expect(game).toHaveProperty('player');
    expect(game).toHaveProperty('enemies');
  });

  test('should initialize with Background and Player instances', () => {
    expect(game.background).toBeInstanceOf(Background);
    expect(game.player).toBeInstanceOf(Player);
    expect(Background).toHaveBeenCalledWith(game);
    expect(Player).toHaveBeenCalledWith(game);
  });

  test('.update should call .update on background, player and enemies array', () => {
    const deltaTime = 16; // The average value
    game.update(deltaTime);
    expect(game.background.update).toHaveBeenCalled();
    expect(game.player.update).toHaveBeenCalledWith(deltaTime);
    game.enemies.forEach(enemy => {
      expect(enemy.update).toHaveBeenCalledWith(deltaTime);
    });
  });

  test('.update should call .addEnemy', () => {
    const addEnemySpy = jest.spyOn(game, 'addEnemy');
    game.update(16);
    expect(addEnemySpy).toHaveBeenCalled();
  });

  test('.update should filter enemies array according to markedForDeletion status', () => {
    expect(game.enemies.some(enemy => enemy.markedForDeletion)).toBe(true);
    game.update(16);
    expect(game.enemies.some(enemy => enemy.markedForDeletion)).toBe(false);
  });

  test('.draw should call draw on background, player and enemies array', () => {
    mockContext = { drawImage: jest.fn() };
    game.background.draw = jest.fn();
    game.player.draw = jest.fn();
    game.draw(mockContext);

    expect(game.background.draw).toHaveBeenCalledWith(mockContext);
    expect(game.player.draw).toHaveBeenCalledWith(mockContext);
    game.enemies.forEach(enemy => {
      expect(enemy.draw).toHaveBeenCalledWith(mockContext);
    });
  });

  test('.addEnemy should add a Zombie1 instance to enemies if empty', () => {
    game.enemies = [];
    expect(game.enemies.length).toBe(0);
    game.addEnemy();
    expect(game.enemies.length).toBe(1);
    // expect(game.enemies[0]).toBeInstanceOf(Zombie1);
  });
});