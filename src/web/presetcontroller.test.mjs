/**
 * @jest-environment jsdom
 */
/**
 * Test class PresetController
 */

import {jest} from '@jest/globals';

import {PresetController} from './presetcontroller.mjs';

// Mock XKPasswd
import XKPasswd from './__mocks__/xkpasswd.mjs';
import {mockGetPresets} from './__mocks__/xkpasswd.mjs';
import {mockGetPreset} from './__mocks__/xkpasswd.mjs';
import {mockSetPreset} from './__mocks__/xkpasswd.mjs';
jest.mock('./__mocks__/xkpasswd.mjs');

// Mock PresetView
import PresetView, {mockBuildPresetButtons} from './__mocks__/presetview.mjs';
jest.mock('./__mocks__/presetview.mjs');

// Mock SettingsController
import SettingsController,
{mockUpdateSettings} from './__mocks__/settingscontroller.mjs';

describe('Test class PresetController', () => {
  beforeEach(() => {
    XKPasswd.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor test', () => {
    test('XKPassword.getPresets should have been called', () => {
      const pc = new PresetController(
        new XKPasswd(),
        new PresetView(),
        new SettingsController());

      expect(mockGetPresets).toHaveBeenCalled();
    });
    test('PresetView.buildPresetButtons should have been called', () => {
      expect(mockBuildPresetButtons).toHaveBeenCalled();
    });
  });
  // test('onPresetChanged test', () => {
  //   pc.onPresetChanged('WEB32');
  //   expect(XKPasswd.setPreset()).toHaveBeenCalled();
  //   expect(SettingsController.updateSettings()).toHaveBeenCalled();
  // });
});
