import { Game } from '../main/main.js';
import { Player } from './player.js';

describe('Player class', () => {
  let game;
  let player;

  beforeEach(() => {
    game = new Game(800, 600);
    player = new Player(game);
  });

  test('should create an instance of Player', () => {
    expect(game).toBeInstanceOf(Game);
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
  });


});