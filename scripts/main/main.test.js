import { Game } from './main.js';
import { Background } from '../background/background.js';
import { Player } from '../player/player.js';
import { Zombie1, Zombie2 } from '../enemies/enemies.js';

// Mock dependencies
jest.mock('../background/background.js');
jest.mock('../player/player.js');
jest.mock('../enemies/enemies.js');
// jest.mock('../enemies/enemies.js', () => ({
//   Zombie1: jest.fn().mockImplementation(() => ({})),
//   Zombie2: jest.fn().mockImplementation(() => ({})),
// }));

// afterEach(() => {
//   jest.restoreAllMocks();
// });

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
    expect(game).toHaveProperty('enemyTimer');
    expect(game).toHaveProperty('enemyInterval');
    expect(game).toHaveProperty('score');
    expect(game).toHaveProperty('health');
    expect(game).toHaveProperty('gameOver');
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
    mockContext = { drawImage: jest.fn(), fillText: jest.fn() };
    game.background.draw = jest.fn();
    game.player.draw = jest.fn();
    game.UI.draw = jest.fn();
    game.draw(mockContext);

    expect(game.background.draw).toHaveBeenCalledWith(mockContext);
    expect(game.player.draw).toHaveBeenCalledWith(mockContext);
    game.enemies.forEach(enemy => {
      expect(enemy.draw).toHaveBeenCalledWith(mockContext);
    });
    expect(game.UI.draw).toHaveBeenCalledWith(mockContext);
  });

  test('.addEnemy should add a Zombie1 instance to enemies if empty', () => {
    game.enemies = [];
    expect(game.enemies.length).toBe(0);
    game.addEnemy(16);
    expect(game.enemies.length).toBe(1);
    expect(game.enemies[0]).toBeInstanceOf(Zombie1);
  });

  test('.addEnemy should add a Zombie2 instance to enemies at certain intervals with 50% chance', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.4);
    game.enemyTimer = 1000;
    game.enemyInterval = 1000;
    game.enemies = [];
    game.addEnemy(16);
    expect(Zombie1).toHaveBeenCalled();
    expect(Zombie2).toHaveBeenCalled();
    jest.clearAllMocks();
    jest.spyOn(Math, 'random').mockReturnValue(0.7);
    game.addEnemy(16);
    expect(Zombie1).not.toHaveBeenCalled();
    expect(Zombie2).not.toHaveBeenCalled();
  });

  test('.healthCheck should set gameOver to true at zero health', () => {
    game.health = 10;
    game.healthCheck();
    expect(game.gameOver).toBe(false);
    game.health = 0;
    game.healthCheck();
    expect(game.gameOver).toBe(true);
  });
});