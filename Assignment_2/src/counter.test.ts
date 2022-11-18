import {describe, expect, test} from '@jest/globals';
import {counter} from './counter';

describe('Counter module', () => {
  test('Passing valid value(1), getA should return 1 and getA as 2 after nextA', () => {
    const [getA, nextA] = counter(1);
    expect(getA()).toBe(1);
    nextA();
    expect(getA()).toBe(2);
  });

  test('Passing empty value, getA should return 0 and getA as 1 after nextA (Initialised with 0 by default)', () => {
    const [getA, nextA] = counter(1);
    expect(getA()).toBe(1);
    nextA();
    expect(getA()).toBe(2);
  });

  test('Passing valid value(5), getA should return 5 and nextA should increment the counter by 1, getA would return 10 after 5 times NextA', () => {
    const [getA, nextA] = counter(5);
    expect(getA()).toBe(5);
    nextA();
    nextA();
    nextA();
    nextA();
    nextA();
    expect(getA()).toBe(10);
  });

});