import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import settingsManager from '../composables/useSetting';

interface Props {
  setSelectedAudioDevice: (device: string) => void;
  selectedAudioDevice: string;
  setSelectedAudioDeviceIndex: (index: number) => void;
  selectedAudioDeviceIndex: number;
  className?: string;
}

const AudioSelector = ({
  setSelectedAudioDevice,
  selectedAudioDevice,
  setSelectedAudioDeviceIndex,
  selectedAudioDeviceIndex,
  className,
}: Props) => {
  const [audioDevices, setAudioDevices] = useState<string[]>([]);

  const set = async (device: string) => {
    setSelectedAudioDevice(device);
    setSelectedAudioDeviceIndex(audioDevices.indexOf(device));
    settingsManager.setCache('audioDevice', device);
    settingsManager.setCache('audioDeviceIndex', audioDevices.indexOf(device));

    await settingsManager.syncCache();
  };

  useEffect(() => {
    (async () => {
      const devices = (await invoke('get_audio_devices')) as string[];
      setAudioDevices(devices);

      if (!selectedAudioDevice || selectedAudioDevice.length === 0) {
        set(devices[0]);
      }
    })();
  }, []);

  return (
    <div className={className}>
      <h1 className="mb-4 text-2xl font-semibold">Audio Selector</h1>
      <ul>
        {audioDevices.map((device, i) => (
          <div
            key={i}
            className="mb-2 flex cursor-pointer items-center rounded border border-black pl-4 hover:bg-gray-200 dark:border-gray-700"
          >
            <input
              id={`${device}-${i}-input`}
              type="radio"
              value={device}
              name="bordered-radio"
              onChange={() => set(device)}
              checked={device === selectedAudioDevice}
              className="h-4 w-4 border-gray-300 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-black"
            />
            <label
              htmlFor={`${device}-${i}-input`}
              className="ml-2 w-full cursor-pointer py-4 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {device}
            </label>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AudioSelector;
