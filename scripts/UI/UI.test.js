import { UI } from './UI.js';

describe('UI class', () => {
  let ui;
  let game;
  let mockContext;

  beforeEach(() => {
    game = {
      gameOver: false,
      score: 123,
      text1: '',
      text2: '',
      text3: '',
      isFreshGame: true,
      winningScore: 20,
    };

    mockContext = {
      font: '',
      textAlign: '',
      fillStyle: '',
      fillText: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn(),
    };

    ui = new UI(game);
  });

  test('should create an instance of UI', () => {
    expect(ui).toBeInstanceOf(UI);
  });

  test('should contain necessary keys', () => {
    expect(ui).toHaveProperty('game');
    expect(ui).toHaveProperty('x');
    expect(ui).toHaveProperty('y');
    expect(ui).toHaveProperty('r');
    expect(ui).toHaveProperty('spacing');
    expect(ui).toHaveProperty('fontSize');
    expect(ui).toHaveProperty('fontFamily');
    expect(ui).toHaveProperty('fontColour');
    expect(ui).toHaveProperty('text1');
    expect(ui).toHaveProperty('text2');
  });

  test('.draw method should call correct context methods', () => {
    ui.draw(mockContext);
    expect(mockContext.fillText).toHaveBeenCalledTimes(12);
    expect(mockContext.fillRect).toHaveBeenCalledTimes(2);
    expect(mockContext.beginPath).toHaveBeenCalledTimes(6);
    expect(mockContext.arc).toHaveBeenCalledTimes(6);
    expect(mockContext.stroke).toHaveBeenCalledTimes(3);
    expect(mockContext.fill).toHaveBeenCalledTimes(3);
  });

  test('.draw method should set text1, text2 and text3 if isFreshGame', () => {
    ui.draw(mockContext);
    expect(ui.text1).toEqual('The goal is not survival, but revenge');
    expect(ui.text2).toEqual('Press spacebar or swipe up to start/pause');
    expect(ui.text3).toEqual('Or press t for Training Mode');
  });

  test('.draw method should set text1 and text2 if gameOver is true and depending on score', () => {
    game.isFreshGame = false;
    game.score = 4;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('');
    game.gameOver = true;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('If you can\'t beat them...');
    expect(ui.text2).toEqual('Join them, Coder-san');
    game.score = game.winningScore;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Coder-san');
    expect(ui.text2).toEqual('You brought honour upon your cojo');
  });
});

