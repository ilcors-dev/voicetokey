import { SettingsManager } from 'tauri-settings';
import { WordKeyMap } from '../components/WordKeyMapper';

type Schema = {
  theme: 'dark' | 'light';
  startFullscreen: boolean;
  accessToken: string;
  modelPath: string;
  keywordsPath: string[];
  audioDevice: string;
  audioDeviceIndex: number;
  wordKeyMap: WordKeyMap[];
  openOnStartup: boolean;
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
  wordKeyMap: [],
  openOnStartup: true,
});

settingsManager.initialize().then(() => {});

export default settingsManager;
