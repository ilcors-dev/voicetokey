import { useEffect, useState } from 'react';
import AccessToken from './components/AccessToken';
import AudioSelector from './components/AudioSelector';
import Settings from './components/Settings';
import VoiceRecognizerRun from './components/VoiceRecognizerRun';
import WordKeyMapper, { WordKeyMap } from './components/WordKeyMapper';
import { usePv } from './composables/usePv';
import settingsManager from './composables/useSetting';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedAudioDeviceIndex, setSelectedAudioDeviceIndex] = useState(0);
  const [keywordPaths, setKeywordPaths] = useState<string[]>([]);
  const [modelPath, setModelPath] = useState('');
  const [wordKeyMap, setWordKeyMap] = useState<WordKeyMap[]>([]);

  useEffect(() => {
    (async () => {
      setAccessToken(await settingsManager.get('accessToken'));
      setModelPath((await usePv().list())[0]);
      setSelectedAudioDevice(await settingsManager.get('audioDevice'));
      setSelectedAudioDeviceIndex(
        await settingsManager.get('audioDeviceIndex'),
      );
      setWordKeyMap(await settingsManager.get('wordKeyMap'));
      setKeywordPaths(wordKeyMap.map((wkm: WordKeyMap) => wkm.wordPath ?? ''));
    })();
  }, []);

  return (
    <div className="px-10 py-10 lg:px-20">
      <AccessToken
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        className="mb-10"
      />
      <AudioSelector
        selectedAudioDevice={selectedAudioDevice}
        setSelectedAudioDevice={setSelectedAudioDevice}
        selectedAudioDeviceIndex={selectedAudioDeviceIndex}
        setSelectedAudioDeviceIndex={setSelectedAudioDeviceIndex}
        className="mb-10"
      />
      <WordKeyMapper
        wordKeyMap={wordKeyMap}
        set={(keys: WordKeyMap[]) => setWordKeyMap(keys)}
      />

      <div className="mt-10">
        <VoiceRecognizerRun
          accessToken={accessToken}
          keywordPaths={keywordPaths}
          modelPath={modelPath}
          inputDeviceIndex={selectedAudioDeviceIndex}
          wordKeyMap={wordKeyMap}
        />
      </div>
      <Settings className="mt-10" />
    </div>
  );
}

export default App;
