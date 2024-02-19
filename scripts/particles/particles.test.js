import { ZombieBlood } from './particles.js';

describe('ZombieBlood class', () => {

  let zombieBloodDrop;
  let mockContext;
  let game

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
      fill: jest.fn() // might need to delete
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
    expect(mockContext.fillStyle).toBe('darkgreen');
    expect(mockContext.fill).toHaveBeenCalled();
  });
});