import { listen } from '@tauri-apps/api/event';
import { resolveResource } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { appWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { info } from 'tauri-plugin-log-api';
import { WordKeyMap } from './WordKeyMapper';

interface Props {
  accessToken: string;
  inputDeviceIndex: number;
  keywordPaths: string[];
  modelPath: string;
  wordKeyMap: WordKeyMap[];
}

const VoiceRecognizerRun = ({
  accessToken,
  inputDeviceIndex,
  keywordPaths,
  modelPath,
  wordKeyMap,
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
    const canRun =
      accessToken.length > 0 &&
      inputDeviceIndex >= 0 &&
      wordKeyMap.length > 0 &&
      modelPath.length > 0;

    info('input device selected index: ' + inputDeviceIndex);
    info('wordKeyMap length: ' + wordKeyMap.length);
    info('modelPath length: ' + modelPath.length);

    return (
      !canRun &&
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

    let porcupineLibrary = await resolveResource(
      'resources/libpv_porcupine.dll',
    );
    let recorderLibrary = await resolveResource('resources/libpv_recorder.dll');

    await invoke('run_voice_recognizer', {
      accessKey: accessToken,
      inputDeviceIndex: inputDeviceIndex,
      keywordPaths: [wordKeyMap[0].wordPath],
      modelPath: modelPath,
      window: appWindow,
      keyCombination: wordKeyMap[0].keyCombination,
      porcupineLibraryPath: porcupineLibrary,
      recorderLibraryPath: recorderLibrary,
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
