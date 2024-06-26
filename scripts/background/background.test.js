import { Layer, Background } from './background';

describe('Layer class', () => {
  let game;
  let layer;
  let mockImage = {};
  let mockContext;

  beforeEach(() => {
    game = {
      width: 800,
      height: 600,
      speed: 0,
    };
    layer = new Layer(game, 3199, 943, mockImage, 1);
    mockContext = { drawImage: jest.fn() };
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
    expect(layer.width).toBe(3199 * (game.height / 943));
    expect(layer.height).toBe(game.height);
    expect(layer.image).toBe(mockImage);
    expect(layer.speedModifier).toBe(1);
    expect(layer.x).toBe(0);
    expect(layer.y).toBe(0);
  });

  test('.update should reset x position to 0 past +image width', () => {
    layer.x = 3200;
    layer.update();
    expect(layer.x).toBe(0);
  });

  test('.update should reset x position to 0 past -image width', () => {
    layer.x = -3200;
    layer.update();
    expect(layer.x).toBe(0);
  });

  test('.update should subtract correct amound from x', () => {
    game.speed = 3;
    layer.update();
    expect(layer.x).toBe(0 - (3 * 1));
  });

  test('.draw should call context.drawImage correct number of times', () => {
    layer.draw(mockContext);
    expect(mockContext.drawImage).toHaveBeenCalledTimes(3);
  });
});

describe('Background class', () => {
  let game;
  let background;
  let mockLayerUpdate;
  let mockContext;

  beforeEach(() => {
    game = {
      width: 800,
      height: 600,
    };
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

  test('.update should call update on each layer', () => {
    mockLayerUpdate = jest.fn();
    background.layer1.update = mockLayerUpdate;
    background.layer2.update = mockLayerUpdate;
    background.layer3.update = mockLayerUpdate;
    background.layer4.update = mockLayerUpdate;
    background.update();
    expect(mockLayerUpdate).toHaveBeenCalledTimes(4);
  });

  test('.draw method should call draw on each layer with context', () => {
    mockContext = { drawImage: jest.fn() };
    background.layer1.draw = jest.fn();
    background.layer2.draw = jest.fn();
    background.layer3.draw = jest.fn();
    background.layer4.draw = jest.fn();

    background.draw(mockContext);
    expect(background.layer1.draw).toHaveBeenCalledWith(mockContext);
    expect(background.layer2.draw).toHaveBeenCalledWith(mockContext);
    expect(background.layer3.draw).toHaveBeenCalledWith(mockContext);
    expect(background.layer4.draw).toHaveBeenCalledWith(mockContext);
  });
});