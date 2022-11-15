import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  accessToken: string;
  inputDeviceIndex: number;
  keywordPaths: string[];
  modelPath: string;
}

const VoiceRecognizerRun = ({
  accessToken,
  inputDeviceIndex,
  keywordPaths,
  modelPath,
}: Props) => {
  const [isListening, setIsListening] = useState(false);

  const run = async () => {
    setIsListening(!isListening);

    await invoke('run_voice_recognizer', {
      access_key: accessToken,
      input_device_index: inputDeviceIndex,
      keyword_paths: keywordPaths,
      model_path: modelPath,
    });

    toast('Started listening.');
  };

  const stop = async () => {
    await invoke('stop_voice_recognizer');
    setIsListening(!isListening);

    toast('Stopped listening.');
  };

  return (
    <>
      <button
        className="btn-primary"
        onClick={() => (isListening ? stop() : run())}
      >
        {isListening ? 'Stop' : 'Start'}
      </button>
    </>
  );
};

export default VoiceRecognizerRun;
