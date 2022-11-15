import { debounce } from 'lodash';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import settingsManager from '../composables/useSetting';

interface Props {
  setAccessToken: (accessToken: string) => void;
  accessToken: string;
  className?: string;
}

const AccessToken = ({ setAccessToken, accessToken, className }: Props) => {
  const showSuccess = useRef(
    debounce(() => toast.success('Access token saved!'), 250),
  );

  const set = async (accessToken: string) => {
    setAccessToken(accessToken);
    await settingsManager.set('accessToken', accessToken);

    showSuccess.current();
  };

  return (
    <>
      <div className={`${className}`}>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Access Token</h1>
        </div>
        <div>
          <input
            type="text"
            id="helper-text"
            aria-describedby="helper-text-explanation"
            value={accessToken}
            onChange={e => set(e.target.value)}
            className="text-input"
          />
          <p
            id="helper-text-explanation"
            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Get it by signing in to{' '}
            <a target="_blank" href="https://picovoice.ai/">
              picovoice.ai
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default AccessToken;
