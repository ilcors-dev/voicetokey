import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import { CgTrash } from 'react-icons/cg';
import settingsManager from '../composables/useSetting';
import KeyRegister from './KeyRegister';

export interface WordKeyMap {
  wordPath?: string;
  keyCombination?: string[];
}

const WordKeyMapper = () => {
  const [wordKeyMap, setWordKeyMap] = useState<WordKeyMap[]>([]);
  const [animationParent] = useAutoAnimate();

  useEffect(() => {
    async () => {
      const c = await settingsManager.get('wordKeyMap');
      setWordKeyMap(c);
    };
  }, []);

  const setKeyCombination = async (i: number, keyCombination: string[]) => {
    const newWordKeyMap = [...wordKeyMap];
    newWordKeyMap[i].keyCombination = keyCombination;
    setWordKeyMap(newWordKeyMap);

    settingsManager.set('wordKeyMap', newWordKeyMap);
    console.log(settingsManager.get('wordKeyMap'));
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Key command mapping</h1>
      </div>
      <div>
        <ul ref={animationParent}>
          {wordKeyMap.map((wordKey, i) => (
            <li
              key={i}
              className="group mb-2 flex cursor-pointer items-center rounded border border-black p-4 hover:bg-gray-200 dark:border-gray-700"
            >
              <div className="grid w-full grid-cols-12 gap-2">
                <div className="col-span-4">
                  <input
                    type="text"
                    className="text-input-border-bottom"
                    placeholder="Name"
                    value={wordKey.wordPath}
                  />
                </div>
                <div className="col-span-3"></div>
                <div className="col-span-5 flex items-center space-x-2">
                  <KeyRegister
                    className="m-auto"
                    keys={wordKey.keyCombination ?? []}
                    setKey={keyCombination =>
                      setKeyCombination(i, keyCombination)
                    }
                  />
                  <button className="btn-shadow ml-auto group-hover:bg-white">
                    <CgTrash size={24} />
                  </button>
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
