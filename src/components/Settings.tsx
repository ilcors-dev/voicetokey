import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import settingsManager from '../composables/useSetting';

interface Props {
  className?: string;
}

const Settings = ({ className }: Props) => {
  const [openOnStartup, setOpenOnStartup] = useState(true);

  useEffect(() => {
    (async () => {
      setOpenOnStartup((await settingsManager.get('openOnStartup')) ?? true);

      await invoke('toggle_run_on_startup', { open: openOnStartup });
    })();
  }, []);

  const set = (open: boolean) => {
    setOpenOnStartup(open);
    settingsManager.set('openOnStartup', open);

    invoke('toggle_run_on_startup', { open: open });
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>
      <div>
        <ul>
          <li className="flex  items-center space-x-1">
            <input
              type="checkbox"
              name="open-on-startup"
              id="open-on-startup"
              checked={openOnStartup}
              onChange={e => set(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-black"
            />
            <label htmlFor="open-on-startup">Open on pc startup</label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
