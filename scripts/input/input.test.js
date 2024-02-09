import { InputHandler } from './input.js';

describe('InputHandler', () => {
  let inputHandler;

  beforeEach(() => {
    // Mocking window.addEventListener to prevent actual event listeners from being added
    jest.spyOn(window, 'addEventListener');
    inputHandler = new InputHandler();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const simulateEvent = (type, key) => {
    const event = new KeyboardEvent(type, { key });
    window.dispatchEvent(event);
  }

  test('add ArrowLeft to keys on keydown', () => {
    simulateEvent('keydown', 'ArrowLeft');
    expect(inputHandler.keys).toContain('ArrowLeft');
  });

  test('removes ArrowLeft from keys on keyup', () => {
    simulateEvent('keydown', 'ArrowLeft');
    simulateEvent('keyup', 'ArrowLeft');
    expect(inputHandler.keys).not.toContain('ArrowLeft');
  });

  test('does not add duplicates of ArrowLeft', () => {
    simulateEvent('keydown', 'ArrowLeft');
    simulateEvent('keydown', 'ArrowLeft');
    expect(inputHandler.keys.filter(key => key === 'ArrowLeft').length).toBe(1);
  });

  it('ignores keys other than ArrowLeft, ArrowRight, ArrowUp, ArrowDown', () => {
    simulateEvent('keydown', 'p');
    expect(inputHandler.keys).toEqual([]);
  });
});
