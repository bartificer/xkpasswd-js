/**
 * @jest-environment jsdom
 *
 * mock file for xkpasswd
 */

import {jest} from '@jest/globals';

// Mock the Model (XKPasswd)
export const mockGetPresets = jest.fn();
export const mockSetPreset = jest.fn();
export const mockGetPreset = jest.fn(() => {
  config: return {};
});

const mock = jest.fn().mockImplementation(() => {
  return {
    getPresets: mockGetPreset,
    setPreset: mockSetPreset,
    getPreset: mockGetPreset,
  };
});

export default mock;
