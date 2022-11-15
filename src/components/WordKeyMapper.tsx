import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef, useState } from 'react';
import KeyRegister from './KeyRegister';

export interface WordKeyMap {
  wordPath?: string;
  key?: string;
}

const WordKeyMapper = () => {
  const [wordKeyMap, setWordKeyMap] = useState<WordKeyMap[]>([]);
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Word To Key</h1>
      </div>
      <div>
        <ul ref={parent}>
          {wordKeyMap.map((wordKey, i) => (
            <li
              key={i}
              className="mb-2 flex cursor-pointer items-center rounded border border-black p-4 hover:bg-gray-200 dark:border-gray-700"
            >
              <div className="grid w-full grid-cols-12">
                <div className="col-span-6">
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Word"
                    value={wordKey.wordPath}
                  />
                </div>
                <div className="col-span-3"></div>
                <div className="col-span-3">
                  <KeyRegister className="m-auto" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="btn-primary"
        onClick={() => setWordKeyMap([...wordKeyMap, {}])}
      >
        Add
      </button>
    </div>
  );
};

export default WordKeyMapper;
