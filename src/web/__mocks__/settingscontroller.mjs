/**
 * @jest-environment jsdom
 *
 * mock file for SettingsController
 */

import {jest} from '@jest/globals';

export const mockUpdateSettings = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    updateSettings: mockUpdateSettings,
  };
});

export default mock;
