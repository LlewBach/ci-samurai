import { Standing, Walking, Dying, Spawning, Turning, Attack1, Attack2 } from './enemyStates.js';
import { ZombieBlood, PlayerBlood } from '../particles/particles.js';

const states = {
  STANDING: 0,
  WALKING: 1,
  DYING: 2,
  SPAWNING: 3,
  TURNING: 4,
  ATTACK1: 5,
  ATTACK2: 6,
}


let game, enemy;

beforeEach(() => {
  game = {
    width: 500,
    speed: 0,
    player: {
      width: 50,
      x: 40,
      attackMargin: 5,
      hitMargin: 10,
      onGround: jest.fn(),
      health: 100,
    },
    score: 0,
    particles: [],
  };

  enemy = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 1,
    jumpSpeed: 8,
    jumpAttacking: false,
    setState: jest.fn(),
    markedForDeletion: false,
    facingRight: -1,
    width: 50,
    x: 20,
    hitMargin: 10,
    attackChoice: 0.1,
  };
});

afterEach(() => {
  enemy = {
    frameX: undefined,
    maxFrame: undefined,
    frameY: undefined,
    speed: undefined,
    maxSpeed: 1,
    jumpSpeed: 8,
    jumpAttacking: false,
    setState: jest.fn(),
    markedForDeletion: false,
    facingRight: -1,
    width: 50,
    x: 20,
    hitMargin: 10,
    attackChoice: 0.1,
  };
});

describe('Standing state', () => {
  let standingState;

  beforeEach(() => {
    standingState = new Standing(game, enemy);
  });

  test('should configure some enemy properties on .enter()', () => {
    standingState.enter();
    expect(enemy.frameX).toBe(0);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(2);
  });

  test('.update should update enemy.speed', () => {
    expect(game.speed).toBe(0);
    game.speed = 7;
    standingState.update();
    expect(enemy.speed).toBe(7);
  });

  test('should transition to WALKING based on enemy.x', () => {
    enemy.x = 440;
    standingState.update();
    expect(enemy.setState).toHaveBeenCalled();
  });
});

describe('Walking state', () => {
  let walkingState;

  beforeEach(() => {
    walkingState = new Walking(game, enemy);
    walkingState.enter();
  });

  test('should configure some enemy properties on .enter()', () => {
    expect(enemy.frameX).toBe(0);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(3);
  });

  test('.update should update enemy.speed', () => {
    expect(game.speed).toBe(0);
    game.speed = 7;
    walkingState.update();
    expect(enemy.speed).toBe(8);
    enemy.facingRight = 1;
    walkingState.update();
    expect(enemy.speed).toBe(6);
  });

  test('.update should transition to ATTACK2 at certain distance left of player for certain percentage of zombies', () => {
    enemy.facingRight = 1;
    game.player.x = 63;
    walkingState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.ATTACK2);
  });

  test('.update should transition to ATTACK2 at certain distance left of player for certain percentage of zombies', () => {
    enemy.facingRight = -1;
    enemy.x = 84
    walkingState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.ATTACK2);
  });

  test('.update should transition to TURNING at certain distance left of player', () => {
    walkingState.update();
    expect(enemy.setState).not.toHaveBeenCalled();
    enemy.x = 0;
    walkingState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.TURNING);
  });

  test('.update should transition to TURNING at certain distance right of player', () => {
    enemy.facingRight = 1;
    enemy.x = 60;
    walkingState.update();
    expect(enemy.setState).not.toHaveBeenCalled();
    enemy.x = 100;
    walkingState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.TURNING);
  });

  test('.update should transition to ATTACK1 at certain distance left of player', () => {
    walkingState.update();
    expect(enemy.setState).not.toHaveBeenCalled();
    enemy.facingRight = 1;
    walkingState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.ATTACK1);
  });

  test('.update should transition to ATTACK1 at certain distance right of player', () => {
    enemy.facingRight = 1;
    enemy.x = 60;
    walkingState.update();
    expect(enemy.setState).not.toHaveBeenCalled();
    enemy.facingRight = -1;
    walkingState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.ATTACK1);
  });
});

describe('Dying state', () => {
  let dyingState;

  beforeEach(() => {
    dyingState = new Dying(game, enemy);
    dyingState.enter();
  });

  test('should configure some enemy properties on .enter()', () => {
    expect(enemy.frameX).toBe(10);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(10);
  });

  test('should unshift 10 zombieBloodDrops to game.particles array for duration of frameY', () => {
    dyingState.update();
    expect(game.particles[0]).toBeInstanceOf(ZombieBlood);
    expect(game.particles[9]).toBeInstanceOf(ZombieBlood);
    enemy.frameX = 11;
    dyingState.update();
    expect(game.particles[10]).toBeInstanceOf(ZombieBlood);
    expect(game.particles[19]).toBeInstanceOf(ZombieBlood);
  });

  test('should modify the standard animate algorithm', () => {
    enemy.frameX = 11;
    dyingState.update();
    expect(enemy.frameX).toBe(0);
    enemy.frameX = 3;
    dyingState.update();
    expect(enemy.markedForDeletion).toBe(true);
    expect(game.score).toBe(1);
  });
});

describe('Spawning state', () => {
  let spawningState;

  beforeEach(() => {
    spawningState = new Spawning(game, enemy);
    spawningState.enter();
  });

  test('should configure some enemy properties on .enter()', () => {
    expect(enemy.frameX).toBe(0);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(0);
  });

  test('should modify the standard animate algorithm', () => {
    enemy.frameX = 11;
    spawningState.update();
    expect(enemy.frameX).toBe(0);
    expect(enemy.frameY).toBe(1);
  });

  test('should transition to STANDING if frameX is 11 and frameY is 1', () => {
    enemy.frameX = 11;
    enemy.frameY = 1;
    spawningState.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.STANDING);
  });
});

describe('Turning state', () => {
  let turningState;

  beforeEach(() => {
    turningState = new Turning(game, enemy);
    turningState.enter();
  });

  test('should configure some enemy properties on .enter()', () => {
    expect(enemy.frameX).toBe(9);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(3);
  });

  test('should modify the standard animate algorithm', () => {
    enemy.frameX = 11;
    turningState.update();
    expect(enemy.frameX).toBe(0);
    expect(enemy.frameY).toBe(4);
  });

  test('should correctly transition to WALKING if frameX is 4', () => {
    enemy.frameX = 4;
    turningState.update();
    expect(enemy.facingRight).toBe(1);
    expect(enemy.setState).toHaveBeenCalledWith(states.WALKING);
  });
});

describe('Attack1 state', () => {
  let attack1State;

  beforeEach(() => {
    attack1State = new Attack1(game, enemy);
    attack1State.enter();
  });

  test('should configure some enemy properties on .enter()', () => {
    expect(enemy.frameX).toBe(5);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(4);
  });

  test('should modify the standard animate algorithm', () => {
    enemy.frameX = 11;
    attack1State.update();
    expect(enemy.frameX).toBe(0);
    expect(enemy.frameY).toBe(5);
  });

  test('should subtract from health, and cause PlayerBlood spatter if frameX is 10 and player.onGround', () => {
    enemy.frameX = 10;
    game.health = 10;
    game.player.onGround.mockReturnValue(true);
    attack1State.update();
    expect(game.health).toBe(9);
    expect(game.particles[0]).toBeInstanceOf(PlayerBlood);
    expect(game.particles[9]).toBeInstanceOf(PlayerBlood);
  });

  test('should correctly transition to STANDING if frameX is 6', () => {
    enemy.frameX = 6;
    enemy.frameY = 5;
    attack1State.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.STANDING);
  });
});

describe('Attack2 state', () => {
  let attack2State;

  beforeEach(() => {
    attack2State = new Attack2(game, enemy);
    attack2State.enter();
  });

  test('should configure some enemy properties on .enter()', () => {
    expect(enemy.frameX).toBe(9);
    expect(enemy.maxFrame).toBe(11);
    expect(enemy.frameY).toBe(5);
  });

  test('should modify the standard animate algorithm', () => {
    enemy.frameX = 11;
    attack2State.update();
    expect(enemy.frameX).toBe(0);
    expect(enemy.frameY).toBe(6);
    enemy.frameX = 3;
    attack2State.update();
    expect(enemy.speed).toBe(8);
    expect(enemy.jumpAttacking).toBe(true);
    enemy.frameX = 8;
    attack2State.update();
    expect(enemy.speed).toBe(0);
    expect(enemy.jumpAttacking = false);
  });

  test('should correctly transition to STANDING if frameX is 9 and frameY is 7', () => {
    enemy.frameX = 9;
    enemy.frameY = 7;
    attack2State.update();
    expect(enemy.setState).toHaveBeenCalledWith(states.STANDING);
  });
});