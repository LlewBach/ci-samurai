import { UI } from './UI.js';

describe('UI class', () => {
  let ui;
  let game;
  let mockContext;

  beforeEach(() => {
    game = { score: 123 };

    mockContext = {
      font: '',
      textAlign: '',
      fillStyle: '',
      fillText: jest.fn(),
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
  });

  test('draw method should set correct font properties and draw score', () => {
    ui.draw(mockContext);
    expect(mockContext.font).toBe(ui.fontSize + 'px ' + ui.fontFamily);
    expect(mockContext.textAlign).toBe('left');
    expect(mockContext.fillStyle).toBe('black');
    expect(mockContext.fillText).toHaveBeenCalledWith('Score: ' + game.score, 20, 50);
  });


});