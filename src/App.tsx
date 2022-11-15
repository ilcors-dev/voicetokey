import { useEffect, useState } from 'react';
import AccessToken from './components/AccessToken';
import AudioSelector from './components/AudioSelector';
import VoiceRecognizerRun from './components/VoiceRecognizerRun';
import WordKeyMapper from './components/WordKeyMapper';
import settingsManager from './composables/useSetting';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedAudioDeviceIndex, setSelectedAudioDeviceIndex] = useState(0);

  useEffect(() => {
    (async () => {
      setAccessToken(await settingsManager.get('accessToken'));
      setSelectedAudioDevice(await settingsManager.get('audioDevice'));
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
      <WordKeyMapper />

      <div className="mt-10">
        <VoiceRecognizerRun
          accessToken={accessToken}
          inputDeviceIndex={selectedAudioDeviceIndex}
        />
      </div>
    </div>
  );
}

export default App;
