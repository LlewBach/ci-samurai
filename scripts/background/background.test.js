import { Game } from '../main/main.js';
import { Layer, Background } from './background';

describe('Layer class', () => {
  let game;
  let layer;
  let mockImage = {};

  beforeEach(() => {
    game = new Game(800, 600);
    layer = new Layer(game, 3199, 943, mockImage, 1);
  });

  test('should create an instance of Layer', () => {
    expect(layer).toBeInstanceOf(Layer);
  });

  test('should contain necessary keys', () => {
    expect(layer).toHaveProperty('game');
    expect(layer).toHaveProperty('width');
    expect(layer).toHaveProperty('height');
    expect(layer).toHaveProperty('image');
    expect(layer).toHaveProperty('speedModifier');
    expect(layer).toHaveProperty('x');
    expect(layer).toHaveProperty('y');
  });

  test('should correctly initialize with given arguments', () => {
    expect(layer.game).toBe(game);
    expect(layer.width).toBe(3199);
    expect(layer.height).toBe(943);
    expect(layer.image).toBe(mockImage);
    expect(layer.speedModifier).toBe(1);
    expect(layer.x).toBe(0);
    expect(layer.y).toBe(0);
  });

  test('should enforce the left boundary', () => {
    layer.x = 50;
    layer.update();
    expect(layer.x).toBe(0);
  });

  test('should reset layer', () => {
    layer.x = -3200;
    layer.update();
    expect(layer.x).toBe(0);
  });
});

describe('Background class', () => {
  let game;
  let background;

  beforeEach(() => {
    game = new Game(800, 600);
    background = new Background(game);
  });

  test('should create an instance of Background', () => {
    expect(background).toBeInstanceOf(Background);
  });

  test('should contain necessary keys', () => {
    expect(background).toHaveProperty('game');
    expect(background).toHaveProperty('width');
    expect(background).toHaveProperty('height');
    expect(background).toHaveProperty('layer1Image');
    expect(background).toHaveProperty('layer2Image');
    expect(background).toHaveProperty('layer3Image');
    expect(background).toHaveProperty('layer4Image');
    expect(background).toHaveProperty('layer1');
    expect(background).toHaveProperty('layer2');
    expect(background).toHaveProperty('layer3');
    expect(background).toHaveProperty('layer4');
    expect(background).toHaveProperty('backgroundLayers');
  });
});