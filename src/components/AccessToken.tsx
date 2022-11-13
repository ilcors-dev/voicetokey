import { Toast } from 'flowbite-react';
import { useToastContext } from 'flowbite-react/lib/esm/components/Toast/ToastContext';
import { useState } from 'react';
import settingsManager from '../composables/useSetting';

interface Props {
  setAccessToken: (accessToken: string) => void;
  accessToken: string;
  className?: string;
}

const AccessToken = ({ setAccessToken, accessToken, className }: Props) => {
  const set = async (accessToken: string) => {
    setAccessToken(accessToken);
    await settingsManager.set('accessToken', accessToken);
  };

  return (
    <>
      <div className="absolute top-6 right-6 flex items-center space-x-4 rounded border border-black p-4 shadow">
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-500 dark:bg-green-800 dark:text-green-200">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Check icon</span>
        </div>
        <div className="ml-3 text-sm font-normal text-black">
          Token successfully saved.
        </div>
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-black hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          data-dismiss-target="#toast-success"
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>
      </div>

      <div className={`${className}`}>
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">Access Token</h1>
        </div>
        <div>
          <input
            type="email"
            id="helper-text"
            aria-describedby="helper-text-explanation"
            value={accessToken}
            onChange={e => set(e.target.value)}
            className="block w-full rounded-lg border border-black p-2.5 text-sm text-gray-900 focus:border-black focus:ring-black  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-black dark:focus:ring-black"
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
