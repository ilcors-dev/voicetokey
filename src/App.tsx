import { useEffect, useState } from 'react';
import AccessToken from './components/AccessToken';
import AudioSelector from './components/AudioSelector';
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

  const canRun =
    accessToken.length > 0 &&
    selectedAudioDeviceIndex >= 0 &&
    keywordPaths.length > 0 &&
    modelPath.length > 0;

  useEffect(() => {
    (async () => {
      setAccessToken(await settingsManager.get('accessToken'));
      setSelectedAudioDevice(await settingsManager.get('audioDevice'));
      setSelectedAudioDeviceIndex(
        await settingsManager.get('audioDeviceIndex'),
      );
      setKeywordPaths(
        (await settingsManager.get('wordKeyMap')).map(
          (wkm: WordKeyMap) => wkm.wordPath ?? '',
        ),
      );
      setModelPath((await usePv().list())[0]);
    })();
  }, []);

  return (
    <div className="px-20 py-10">
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
        set={(keys: WordKeyMap[]) =>
          setKeywordPaths(keys.map(k => k.wordPath ?? ''))
        }
      />

      <div className="mt-10">
        <VoiceRecognizerRun
          accessToken={accessToken}
          keywordPaths={keywordPaths}
          modelPath={modelPath}
          inputDeviceIndex={selectedAudioDeviceIndex}
          disabled={!canRun}
        />
      </div>
    </div>
  );
}

export default App;
