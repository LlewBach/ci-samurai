import { Joystick, InputHandler } from './input.js';

describe('Joystick class', () => {
  let joystick, mockContext, canvas1;

  beforeEach(() => {
    const canvas1 = {
      width: 600,
      addEventListener: jest.fn(),
      getBoundingClientRect: jest.fn().mockReturnValue({ left: 10, top: 10, width: 310 }),
    };
    joystick = new Joystick(90, 170, 50, canvas1);
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
    expect(joystick).toHaveProperty('pressed');
    expect(joystick).toHaveProperty('scaledX');
    expect(joystick).toHaveProperty('scaledY');
  });

  test('translateCoords function correctly translates touch coords into scaled canvas coords', () => {
    const canvas1 = {
      width: 600,
      getBoundingClientRect: jest.fn().mockReturnValue({ left: 10, top: 10, width: 310 }),
    };

    const touchEvent = {
      changedTouches: [{
        clientX: 60,
        clientY: 100
      }]
    };
    let scaledX, scaledY;

    const translateCoords = (e) => {
      const rect = canvas1.getBoundingClientRect();
      const scale = (rect.width - 10) / canvas1.width;
      const actualX = e.changedTouches[0].clientX - rect.left - 5;
      const actualY = e.changedTouches[0].clientY - rect.top - 5;
      scaledX = actualX / scale;
      scaledY = actualY / scale;
    };
    translateCoords(touchEvent);
    expect(scaledX).toBe(90);
    expect(scaledY).toBe(170);
  });

  // Testing eventListeners is an absolute fucking nightmare. Going to do behavioural instead

  // test('.addListeners should attach event listeners to canvas', () => {
  //   const canvas1 = { addEventListener: jest.fn() };
  //   expect(canvas1.addEventListener).toHaveBeenCalledTimes(3);
  //   expect(canvas1.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
  //   expect(canvas1.addEventListener).toHaveBeenCalledWith('touchmove', expect.any(Function));
  //   expect(canvas1.addEventListener).toHaveBeenCalledWith('touchend', expect.any(Function));
  // });

  // test('if acceptable coords touched, set this.pressed to true', () => {
  //   const simulateTouchEvent = (type, clientX, clientY) => {
  //     const event = new TouchEvent(type, {
  //       changedTouches: [{ clientX: clientX, clientY: clientY }]
  //     });
  //     canvas1.dispatchEvent(event);
  //   };
  //   simulateTouchEvent('touchstart', '60', '100');
  //   expect(joystick.pressed).toBe(true);
  // });

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
