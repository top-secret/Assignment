import {describe, expect, test} from '@jest/globals';
import {counter} from './counter';

describe('Counter module', () => {
  test('Counter 1 to Get', () => {
    expect(counter(1)).toBe(1);
  });
});