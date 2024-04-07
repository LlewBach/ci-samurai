import { ZombieBlood, PlayerBlood } from './particles.js';

let zombieBloodDrop;
let playerBloodDrop;
let mockContext;
let game;
let enemy;

describe('ZombieBlood class', () => {
  beforeEach(() => {
    game = {
      player: {
        facingRight: 1,
      },
      speed: 0,
    };

    zombieBloodDrop = new ZombieBlood(game, 10, 10);
    mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      fillStyle: '',
      fill: jest.fn()
    };
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  test('zombieBloodDrop should be an instance of ZombieBlood', () => {
    expect(zombieBloodDrop).toBeInstanceOf(ZombieBlood);
  });

  test('should contain necessary keys', () => {
    expect(zombieBloodDrop).toHaveProperty('game');
    expect(zombieBloodDrop).toHaveProperty('x');
    expect(zombieBloodDrop).toHaveProperty('y');
    expect(zombieBloodDrop).toHaveProperty('markedForDeletion');
    expect(zombieBloodDrop).toHaveProperty('size');
    expect(zombieBloodDrop).toHaveProperty('speedX');
    expect(zombieBloodDrop).toHaveProperty('speedY');
    expect(zombieBloodDrop).toHaveProperty('gravity');
    expect(zombieBloodDrop).toHaveProperty('colour');
  });

  test('.update should adjust x, y, speedY, size and markedForDeletion properties correctly', () => {
    zombieBloodDrop.update();
    expect(zombieBloodDrop.x).toBe(15);
    expect(zombieBloodDrop.y).toBe(1.5);
    expect(zombieBloodDrop.speedY).toBe(7.5);
    expect(zombieBloodDrop.size).toBe(6.5 * 0.9);
    zombieBloodDrop.size = 0.4;
    zombieBloodDrop.update();
    expect(zombieBloodDrop.markedForDeletion).toBe(true);
  });

  test('.draw should call mockContext methods', () => {
    zombieBloodDrop.draw(mockContext);
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalledWith(10, 10, 6.5, 0, Math.PI * 2);
    expect(mockContext.fillStyle).toBe('#0aff0a');
    expect(mockContext.fill).toHaveBeenCalled();
  });
});

describe('PlayerBlood class', () => {
  beforeEach(() => {
    game = {
      player: {
        facingRight: 1,
      },
      speed: 0,
    };
    enemy = {
      facingRight: -1,
    };

    playerBloodDrop = new PlayerBlood(game, 10, 10, enemy.facingRight);
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  test('.update should adjust x, y, speedY and size properties correctly', () => {
    playerBloodDrop.update();
    expect(playerBloodDrop.x).toBe(-5);
    expect(playerBloodDrop.y).toBe(1.5);
    expect(playerBloodDrop.speedY).toBe(7.5);
    expect(playerBloodDrop.size).toBe(4.5 * 0.9);
  });
});