import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';

const VoiceRecognizerRun = () => {
  const [isListening, setIsListening] = useState(false);

  const run = async () => {
    setIsListening(true);
    await invoke('run_voice_recognizer', {});
  };

  return (
    <>
      <button className="rounded border border-black px-4 py-1 hover:bg-gray-200">
        Run
      </button>
    </>
  );
};

export default VoiceRecognizerRun;
