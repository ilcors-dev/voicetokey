import autoAnimate from '@formkit/auto-animate';
import { useEffect, useRef, useState } from 'react';
import { CgTrash } from 'react-icons/cg';
import settingsManager from '../composables/useSetting';
import KeyRegister from './KeyRegister';
import WakeWordSelector from './WakeWordSelector';

export interface WordKeyMap {
  name?: string;
  wordPath?: string;
  keyCombination?: string[];
}

interface Props {
  set: (keys: WordKeyMap[]) => void;
}

const WordKeyMapper = ({ set }: Props) => {
  const [wordKeyMap, setWordKeyMap] = useState<WordKeyMap[]>([]);
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    (async () => {
      const c = await settingsManager.get('wordKeyMap');
      setWordKeyMap(c);
    })();
  }, []);

  const setName = (i: number, name: string) => {
    const newWordKeyMap = [...wordKeyMap];
    newWordKeyMap[i].name = name;
    setWordKeyMap(newWordKeyMap);

    settingsManager.set('wordKeyMap', newWordKeyMap);

    set(newWordKeyMap);
  };

  const setPpn = (i: number, path: string) => {
    const newWordKeyMap = [...wordKeyMap];
    newWordKeyMap[i].wordPath = path;
    setWordKeyMap(newWordKeyMap);

    settingsManager.set('wordKeyMap', newWordKeyMap);

    set(newWordKeyMap);
  };

  const setKeyCombination = async (i: number, keyCombination: string[]) => {
    const newWordKeyMap = [...wordKeyMap];
    newWordKeyMap[i].keyCombination = keyCombination;
    setWordKeyMap(newWordKeyMap);

    settingsManager.set('wordKeyMap', newWordKeyMap);

    set(newWordKeyMap);
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Key command mapping</h1>
      </div>
      <div>
        <ul ref={parent}>
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
                    value={wordKey.name}
                    onChange={e => setName(i, e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <WakeWordSelector
                    wakeWord={wordKey.wordPath}
                    setSelected={(path: string) => setPpn(i, path)}
                  />
                </div>
                <div className="col-span-5 flex items-center space-x-2">
                  <KeyRegister
                    className="m-auto"
                    keys={wordKey.keyCombination ?? []}
                    setKey={keyCombination =>
                      setKeyCombination(i, keyCombination)
                    }
                  />
                  <button
                    className="btn-shadow ml-auto group-hover:bg-white"
                    onClick={() =>
                      setWordKeyMap(wordKeyMap.filter((_, j) => j !== i))
                    }
                  >
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
