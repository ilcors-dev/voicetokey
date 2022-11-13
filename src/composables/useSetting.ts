import { SettingsManager } from 'tauri-settings';

type Schema = {
  theme: 'dark' | 'light';
  startFullscreen: boolean;
  accessToken: string;
  modelPath: string;
  keywordsPath: string[];
  audioDevice: string;
  audioDeviceIndex: number;
};

const settingsManager = new SettingsManager<Schema>({
  // defaults
  theme: 'light',
  startFullscreen: false,
  accessToken: '',
  modelPath: '',
  keywordsPath: [],
  audioDevice: '',
  audioDeviceIndex: 0,
});

settingsManager.initialize().then(() => {});

export default settingsManager;
