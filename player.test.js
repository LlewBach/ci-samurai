import { Player } from './player.js';

describe('Player class', () => {
  test('should create an instance of Player', () => {
    const player = new Player();
    expect(player).toBeInstanceOf(Player);
  });

  test('should contain necessary keys', () => {
    const player = new Player();
    expect(player).toHaveProperty('image');
    expect(player).toHaveProperty('spriteWidth');
    expect(player).toHaveProperty('spriteHeight');
  });
});