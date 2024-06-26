import { Game } from './main.js';
import { Background } from '../background/background.js';
import { Joystick, ControlPad, InputHandler } from '../input/input.js';
import { UI } from '../user-interface/user-interface.js';
import { Player } from '../player/player.js';
import { Zombie1, Zombie2 } from '../enemies/enemies.js';

// Mock dependencies
jest.mock('../background/background.js');
jest.mock('../input/input.js');
jest.mock('../user-interface/user-interface.js');
jest.mock('../player/player.js');
jest.mock('../enemies/enemies.js');

describe('Game class', () => {
  let game, mockContext, canvas1;

  beforeEach(() => {
    jest.clearAllMocks();
    canvas1 = {};
    game = new Game(800, 600, canvas1);
    game.enemies = [
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: false },
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: true }
    ];
    game.particles = [
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: false },
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: true }
    ];
    game.floatingText = [
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: false },
      { update: jest.fn(), draw: jest.fn(), markedForDeletion: true }
    ];
    mockContext = {
      drawImage: jest.fn(),
      fillText: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
      fillRect: jest.fn()
    };
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
    expect(game).toHaveProperty('joystick');
    expect(game).toHaveProperty('controlPad');
    expect(game).toHaveProperty('input');
    expect(game).toHaveProperty('UI');
    expect(game).toHaveProperty('player');
    expect(game).toHaveProperty('particles');
    expect(game).toHaveProperty('floatingText');
    expect(game).toHaveProperty('enemies');
    expect(game).toHaveProperty('enemyTimer');
    expect(game).toHaveProperty('enemyInterval');
    expect(game).toHaveProperty('enemyRandomFactor');
    expect(game).toHaveProperty('score');
    expect(game).toHaveProperty('winningScore');
    expect(game).toHaveProperty('health');
    expect(game).toHaveProperty('energy');
    expect(game).toHaveProperty('gameOver');
    expect(game).toHaveProperty('isPaused');
    expect(game).toHaveProperty('isTouchScreen');
    expect(game).toHaveProperty('annotateMode');
    expect(game).toHaveProperty('trainingMode');
    expect(game).toHaveProperty('isFreshGame');
  });

  test('should initialize with class instances', () => {
    expect(game.background).toBeInstanceOf(Background);
    expect(game.joystick).toBeInstanceOf(Joystick);
    expect(game.controlPad).toBeInstanceOf(ControlPad);
    expect(game.input).toBeInstanceOf(InputHandler);
    expect(game.UI).toBeInstanceOf(UI);
    expect(game.player).toBeInstanceOf(Player);
  });

  test('class instances should initialize correctly', () => {
    expect(Background).toHaveBeenCalledWith(game);
    expect(Joystick).toHaveBeenCalledWith(90, 200, canvas1);
    expect(ControlPad).toHaveBeenCalledWith(game.width - 90, 180, canvas1, game);
    expect(UI).toHaveBeenCalledWith(game);
    expect(Player).toHaveBeenCalledWith(game);
  });

  test('.update should call .update on background, player, particles and enemies array', () => {
    const deltaTime = 16; // The average value
    game.update(deltaTime);
    expect(game.background.update).toHaveBeenCalled();
    expect(game.joystick.update).not.toHaveBeenCalled();
    expect(game.player.update).toHaveBeenCalledWith(deltaTime);
    game.enemies.forEach(enemy => {
      expect(enemy.update).toHaveBeenCalledWith(deltaTime);
    });
    game.particles.forEach(particle => {
      expect(particle.update).toHaveBeenCalled();
    });
    game.floatingText.forEach(message => {
      expect(message.update).toHaveBeenCalled();
    });
  });

  test('.update should call joystick.update if game.isTouchScreen is true', () => {
    game.isTouchScreen = true;
    game.update(16);
    expect(game.joystick.update).toHaveBeenCalled();
  });

  test('.update should call .addEnemy if game.trainingMode is false and score < winningScore', () => {
    const addEnemySpy = jest.spyOn(game, 'addEnemy');
    game.score = game.winningScore + 1;
    game.trainingMode = true;
    game.update(16);
    expect(addEnemySpy).not.toHaveBeenCalled();
    game.score = game.winningScore - 1;
    game.update(16);
    expect(addEnemySpy).not.toHaveBeenCalled();
    game.trainingMode = false;
    game.update(16);
    expect(addEnemySpy).toHaveBeenCalled();
  });

  test('.update should filter enemies, particles and floatingText arrays according to markedForDeletion status', () => {
    expect(game.enemies.some(enemy => enemy.markedForDeletion)).toBe(true);
    expect(game.particles.some(particle => particle.markedForDeletion)).toBe(true);
    expect(game.floatingText.some(message => message.markedForDeletion)).toBe(true);
    game.update(16);
    expect(game.enemies.some(enemy => enemy.markedForDeletion)).toBe(false);
    expect(game.particles.some(particle => particle.markedForDeletion)).toBe(false);
    expect(game.floatingText.some(message => message.markedForDeletion)).toBe(false);
  });

  test('.draw should set fillStyle depending on class boolean values', () => {
    game.isFreshGame = false;
    game.isPaused = false;
    game.gameOver = false;
    game.trainingMode = false;
    game.draw(mockContext);
    expect(mockContext.fillStyle).toEqual('rgba(0, 0, 0, 0.1)');
    game.isFreshGame = true;
    game.draw(mockContext);
    expect(mockContext.fillStyle).toEqual('rgba(0, 0, 0, 0.5)');
    game.isFreshGame = false;
    game.isPaused = true;
    game.draw(mockContext);
    expect(mockContext.fillStyle).toEqual('rgba(0, 0, 0, 0.5)');
    game.isPaused = false;
    game.gameOver = true;
    game.draw(mockContext);
    expect(mockContext.fillStyle).toEqual('rgba(0, 0, 0, 0.5)');
    game.gameOver = false;
    game.trainingMode = true;
    game.draw(mockContext);
    expect(mockContext.fillStyle).toEqual('rgba(0, 0, 0, 0.5)');
  });

  test('.draw should call draw method on correct game properties', () => {
    game.background.draw = jest.fn();
    game.player.draw = jest.fn();
    game.UI.draw = jest.fn();
    game.joystick.draw = jest.fn();
    game.controlPad.draw = jest.fn();
    game.draw(mockContext);
    expect(game.background.draw).toHaveBeenCalledWith(mockContext);
    expect(game.player.draw).toHaveBeenCalledWith(mockContext);
    game.enemies.forEach(enemy => {
      expect(enemy.draw).toHaveBeenCalledWith(mockContext);
    });
    game.particles.forEach(particle => {
      expect(particle.draw).toHaveBeenCalledWith(mockContext);
    });
    game.floatingText.forEach(message => {
      expect(message.draw).toHaveBeenCalledWith(mockContext);
    });
    expect(game.UI.draw).toHaveBeenCalledWith(mockContext);
    expect(game.joystick.draw).not.toHaveBeenCalledWith(mockContext);
    expect(game.controlPad.draw).not.toHaveBeenCalledWith(mockContext);
  });

  test('.draw should call joystick and controlPad draw methods if game.isTouchScreen is true, and if game.gameOver and game.isPaused are false', () => {
    game.isTouchScreen = true;
    game.draw(mockContext);
    expect(game.joystick.draw).not.toHaveBeenCalledWith(mockContext);
    expect(game.controlPad.draw).not.toHaveBeenCalledWith(mockContext);
    game.gameOver = false;
    game.draw(mockContext);
    expect(game.joystick.draw).not.toHaveBeenCalledWith(mockContext);
    expect(game.controlPad.draw).not.toHaveBeenCalledWith(mockContext);
    game.isPaused = false;
    game.draw(mockContext);
    expect(game.joystick.draw).toHaveBeenCalledWith(mockContext);
    expect(game.controlPad.draw).toHaveBeenCalledWith(mockContext);
  });

  test('.healthCheck should set gameOver to true at zero health', () => {
    game.health = 10;
    game.healthCheck();
    expect(game.gameOver).toBe(false);
    game.health = 0;
    game.healthCheck();
    expect(game.gameOver).toBe(true);
  });

  test('.restart should reset necessary game properties', () => {
    game.speed = 10;
    game.particles = ['particle0'];
    game.floatingText = ['text0'];
    game.enemies = ['enemy0'];
    game.enemyTimer = 20;
    game.enemyRandomFactor = 0.35;
    game.score = 10;
    game.health = 50;
    game.energy = 30;
    game.gameOver = true;
    game.isPaused = true;
    game.restart();
    expect(game.speed).toBe(0);
    expect(game.particles).toEqual([]);
    expect(game.floatingText).toEqual([]);
    expect(game.enemies).toEqual([]);
    expect(game.enemyTimer).toBe(0);
    expect(game.enemyRandomFactor).toBe(0.3);
    expect(game.score).toBe(0);
    expect(game.health).toBe(100);
    expect(game.energy).toBe(5);
    expect(game.gameOver).toBe(false);
    expect(game.isPaused).toBe(true);
  });
});