import { Symbol, MatrixRain } from './matrix.js';

describe('Symbol class', () => {
  let symbol, mockContext, game;

  beforeEach(() => {
    game = {
      gameOver: false
    };
    symbol = new Symbol(5, 5, 25, 500, game);
    mockContext = {
      fillText: jest.fn()
    };
  });

  // afterEach(() => {
  //   Math.random.mockRestore();
  // });

  test('should be an instance of Symbol', () => {
    expect(symbol).toBeInstanceOf(Symbol);
  });

  test('should have necessary keys', () => {
    expect(symbol).toHaveProperty('characters');
    expect(symbol).toHaveProperty('x');
    expect(symbol).toHaveProperty('y');
    expect(symbol).toHaveProperty('fontSize');
    expect(symbol).toHaveProperty('text');
    expect(symbol).toHaveProperty('canvasHeight');
    expect(symbol).toHaveProperty('game');
    expect(symbol).toHaveProperty('threshold');
  });

  test('.update should reset threshold property depending on game.gameOver status', () => {
    expect(symbol.threshold).toBe(0.98);
    game.gameOver = true;
    symbol.update();
    expect(symbol.threshold).toBe(0.999);
  });

  test('.update should select random character', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    symbol.update();
    expect(symbol.text).toBe('ヘ');
  });


  test('.update should increment or reset y value once past screen height and depending on random number threshold', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    symbol.y = 21;
    symbol.update();
    expect(symbol.y).toBe(22);
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
    symbol.y = 21;
    symbol.update();
    expect(symbol.y).toBe(0);
  });

  test('.draw should call context function correctly', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    symbol.update();
    symbol.draw(mockContext);
    expect(mockContext.fillText).toHaveBeenCalledWith('ヘ', 125, 150);
  });
});

describe('MatrixRain Class', () => {
  let matrix, game, mockContext;

  beforeEach(() => {
    mockContext = {
      fillStyle: '',
      fillRect: jest.fn(),
      fillStyle: '',
      font: '',
      fillText: jest.fn()
    };
    game = {
      colour: '#0aff0a',
      gameOver: false,
      player: {
        currentState: 'state0',
        states: ['state0', 'state1', 'state2', 'state3', 'state4', 'state5']
      }
    };
    matrix = new MatrixRain(game, 500, 500);
    matrix.symbols = [{ update: jest.fn(), draw: jest.fn() }, { update: jest.fn(), draw: jest.fn() }];
  });

  test('should be an instance of MatrixRain class', () => {
    expect(matrix).toBeInstanceOf(MatrixRain);
  });

  test('should have necessary keys', () => {
    expect(matrix).toHaveProperty('game');
    expect(matrix).toHaveProperty('canvasWidth');
    expect(matrix).toHaveProperty('canvasHeight');
    expect(matrix).toHaveProperty('fontSize');
    expect(matrix).toHaveProperty('columns');
    expect(matrix).toHaveProperty('symbols');
    expect(matrix).toHaveProperty('fps');
    expect(matrix).toHaveProperty('frameInterval');
    expect(matrix).toHaveProperty('frameTimer');
    expect(matrix).toHaveProperty('colour');
  });

  test('should correctly initialize some properties', () => {
    expect(matrix.canvasWidth).toBe(500);
    expect(matrix.canvasHeight).toBe(500);
    expect(matrix.columns).toBe(20);
  });

  test('.initialize should set up each column with a symbol instance', () => {
    matrix.initialize();
    expect(matrix.symbols.length).toBe(matrix.columns);
    expect(matrix.symbols[0]).toBeInstanceOf(Symbol);
  });

  test('.colourState should update matrix colour depending on gameOver status, player state', () => {
    game.gameOver = true;
    matrix.colourState();
    expect(matrix.colour).toBe('white');
    game.gameOver = false;
    matrix.colourState();
    expect(matrix.colour).toBe('#0aff0a');
    game.player.currentState = game.player.states[5];
    matrix.colourState();
    expect(matrix.colour).toBe('red');
  });

  test('.update should increment or reset frameTimer', () => {
    matrix.update(16);
    expect(matrix.frameTimer).toBe(16);
    matrix.frameTimer = matrix.frameInterval;
    matrix.update(16);
    expect(matrix.frameTimer).toBe(0);
  });

  test('.update should call update on each symbol in array', () => {
    matrix.frameTimer = matrix.frameInterval;
    matrix.update(16);
    matrix.symbols.forEach(symbol => {
      expect(symbol.update).toHaveBeenCalled();
    });
  });

  test('.draw should call own .fillRect method and .draw method for each symbol', () => {
    matrix.draw(mockContext);
    expect(mockContext.fillRect).toHaveBeenCalled();
    matrix.symbols.forEach(symbol => {
      expect(symbol.draw).toHaveBeenCalledWith(mockContext);
    });
  });

  test('.resize should reset necessary property values', () => {
    matrix.resize(250, 250);
    expect(matrix.canvasWidth).toBe(250);
    expect(matrix.canvasHeight).toBe(250);
    expect(matrix.columns).toBe(10);
  });
});