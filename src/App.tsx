import { useEffect, useState } from 'react';
import AccessToken from './components/AccessToken';
import AudioSelector from './components/AudioSelector';
import VoiceRecognizerRun from './components/VoiceRecognizerRun';
import settingsManager from './composables/useSetting';

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');

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
      />

      <div className="mt-10">
        <h1 className="mb-4 text-2xl font-semibold">Selected Audio Device</h1>
        <p>{selectedAudioDevice}</p>
        <VoiceRecognizerRun />
      </div>
    </div>
  );
}

export default App;
