/**
 * @jest-environment jsdom
 *
 * mock file for PresetView
 */

import {jest} from '@jest/globals';

export const mockBuildPresetButtons = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    buildPresetButtons: mockBuildPresetButtons,
  };
});

export default mock;
