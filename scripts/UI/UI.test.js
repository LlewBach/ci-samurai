import { UI } from './UI.js';

describe('UI class', () => {
  let ui;
  let game;
  let mockContext;

  beforeEach(() => {
    game = {
      score: 123,
      text1: '',
      text2: '',
    };

    mockContext = {
      font: '',
      textAlign: '',
      fillStyle: '',
      fillText: jest.fn(),
      fillRect: jest.fn(),
    };

    ui = new UI(game);
  });

  test('should create an instance of UI', () => {
    expect(ui).toBeInstanceOf(UI);
  });

  test('should contain necessary keys', () => {
    expect(ui).toHaveProperty('game');
    expect(ui).toHaveProperty('fontSize');
    expect(ui).toHaveProperty('fontFamily');
    expect(ui).toHaveProperty('fontColour');
    expect(ui).toHaveProperty('text1');
    expect(ui).toHaveProperty('text2');
  });

  test('.draw method should set correct font properties and draw score', () => {
    ui.draw(mockContext);
    expect(mockContext.font).toBe(ui.fontSize + 'px ' + ui.fontFamily);
    expect(mockContext.textAlign).toBe('left');
    // expect(mockContext.fillStyle).toBe('black');
    expect(mockContext.fillText).toHaveBeenCalledWith('Score: ' + game.score, 20, 50);
  });

  test('.draw method should draw health bar', () => {
    ui.draw(mockContext);
    expect(mockContext.fillText).toHaveBeenCalledWith('Health: ' + game.health, 420, 50);
    // expect(mockContext.fillStyle).toBe('green');
    expect(mockContext.fillRect).toHaveBeenCalledWith(580, 29, game.health * 2, 20);
  });

  test('.draw method should set text1 and text2 if gameOver is true and depending on score', () => {
    game.score = 4;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('');
    game.gameOver = true;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('If you can\'t beat them...');
    expect(ui.text2).toEqual('Join them');
    game.score = 6;
    ui.draw(mockContext);
    expect(ui.text1).toEqual('Coder-san');
    expect(ui.text2).toEqual('You brought honour upon your cojo');
  });
});