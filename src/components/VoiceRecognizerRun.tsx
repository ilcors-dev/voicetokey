import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  accessToken: string;
  inputDeviceIndex: number;
  keywordPaths: string[];
  modelPath: string;
  disabled?: boolean;
}

const VoiceRecognizerRun = ({
  accessToken,
  inputDeviceIndex,
  keywordPaths,
  modelPath,
  disabled,
}: Props) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    (async () => {
      await listen('wake-word-detected', event => {
        toast('Wake word detected, firing key combination.');
      });
    })();
  }, []);

  const isDisabled = () => {
    return (
      disabled &&
      toast.error(
        'Select all options first (access token, audio device, key mapping).',
      )
    );
  };

  const run = async () => {
    if (isDisabled()) {
      return;
    }

    setIsListening(!isListening);

    await invoke('run_voice_recognizer', {
      accessKey: accessToken,
      inputDeviceIndex: inputDeviceIndex,
      keywordPaths: keywordPaths,
      modelPath: modelPath,
      window: appWindow,
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
