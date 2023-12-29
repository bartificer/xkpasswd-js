/**
 * Test class Presets
 */

import {Presets} from './presets.mjs';

describe('Test class Presets', () => {
  const me = Presets;
  describe('Test function getDefault()', () => {
    /*
     * Because it is a static function, I don't think I need to initialize
     */
    test('it results in an object', () => {
      expect(typeof me.getDefault()).toEqual('object');
    });
    test('its result has a property "num_words"', () => {
      const obj = me.getDefault();

      expect(typeof obj.config.num_words !== undefined).toBe(true);
      expect(obj.config.num_words).toBe(3);
    });
  });
});
