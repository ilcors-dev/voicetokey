import { uniq } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsKeyboardFill } from 'react-icons/bs';
import KeyCollection from './KeyCollection';

interface Props {
  className?: string;
  keys: string[];
  setKey: (keyCombination: string[]) => void;
}

const KeyRegister = ({ className, keys, setKey }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const [keyCombination, setKeyCombination] = useState<string[]>(keys);

  const startListening = () => {
    toast.custom(
      <div className="rounded border-2 border-black bg-white p-4 text-black">
        <p>
          Press <b>any key</b> to register the combination.
        </p>
        <p>
          Press <b>Esc</b> to cancel
        </p>
        <p>
          Press <b>Enter</b> to save.
        </p>
        <p>
          Press <b>Del</b> to remove last key.
        </p>
      </div>,
    );
    setIsListening(true);
  };

  const handleKeyRegister = useCallback(
    (event: KeyboardEvent) => {
      if (!isListening) {
        return;
      }

      if (event.key === 'Escape') {
        setIsListening(false);
        setKeyCombination([]);
        return;
      }

      if (event.key === 'Enter') {
        setIsListening(false);

        toast.success('Key combination saved.');

        setKey(keyCombination);
        return;
      }

      if (event.key === 'Backspace') {
        setKeyCombination(keyCombination.slice(0, -1));
        return;
      }

      setKeyCombination(
        uniq([...keyCombination, event.key]).sort(
          (a: string, b: string) => b.length - a.length,
        ),
      );
    },
    [isListening, keyCombination],
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keyup', handleKeyRegister);

    // remove the event listener
    return () => {
      document.removeEventListener('keyup', handleKeyRegister);
    };
  }, [handleKeyRegister]);

  return (
    <div className={`${className} flex w-full items-center`}>
      {(isListening || (!isListening && keyCombination.length > 0)) && (
        <KeyCollection className="w-full" keys={keyCombination} />
      )}
      {!isListening && (
        <button
          className="btn-shadow ml-auto group-hover:bg-white"
          onClick={() => startListening()}
        >
          <BsKeyboardFill size={24} />
        </button>
      )}
    </div>
  );
};

export default KeyRegister;
