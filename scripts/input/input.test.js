import { Joystick, InputHandler } from './input.js';

describe('Joystick class', () => {
  let joystick, mockContext;

  beforeEach(() => {
    joystick = new Joystick(100, 100, 50);
    mockContext = {
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
      fill: jest.fn()
    }
  });

  test('should have correct keys', () => {
    expect(joystick).toHaveProperty('x');
    expect(joystick).toHaveProperty('y');
    expect(joystick).toHaveProperty('r');
    expect(joystick).toHaveProperty('X');
    expect(joystick).toHaveProperty('Y');
    expect(joystick).toHaveProperty('R');
  });

  test('draw should call context methods', () => {
    joystick.draw(mockContext);
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.arc).toHaveBeenCalled();
    expect(mockContext.stroke).toHaveBeenCalled();
    expect(mockContext.fill).toHaveBeenCalled();
  });
});

describe('InputHandler class', () => {
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

  // const simulateTouchEvent = (type, pageY) => {
  //   const event = new TouchEvent(type, {
  //     changedTouches: [{ pageY: pageY }]
  //   });
  //   window.dispatchEvent(event);
  // };

  test('should have correct key', () => {
    expect(inputHandler).toHaveProperty('keys');
  });

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

  test('ignores keys other than ArrowLeft, ArrowRight, ArrowUp, ArrowDown, a', () => {
    simulateEvent('keydown', 'p');
    expect(inputHandler.keys).toEqual([]);
  });

  // test('touching screen updates touchY value', () => {
  //   simulateTouchEvent('touchstart', '50');
  //   expect(inputHandler.touchY).toBe('50');
  // });

  // test('swiping further than threshold should push "swipe down" to keys array', () => {
  //   simulateTouchEvent('touchstart', '50');
  //   simulateTouchEvent('touchmove', '79');
  //   expect(inputHandler.keys).not.toContain('swipe down');
  //   simulateTouchEvent('touchmove', '81');
  //   expect(inputHandler.keys).toContain('swipe down');
  // });

  // test('swiping further than threshold should push "swipe up" to keys array', () => {
  //   simulateTouchEvent('touchstart', '50');
  //   simulateTouchEvent('touchmove', '21');
  //   expect(inputHandler.keys).not.toContain('swipe up');
  //   simulateTouchEvent('touchmove', '19');
  //   expect(inputHandler.keys).toContain('swipe up');
  // });

  // test('touchend event should remove touch values from keys array', () => {
  //   simulateTouchEvent('touchstart', '50');
  //   simulateTouchEvent('touchmove', '81');
  //   simulateTouchEvent('touchend', 0);
  //   expect(inputHandler.keys).not.toContain('swipe down');
  // });
});
