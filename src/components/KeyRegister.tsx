import { useCallback, useEffect, useState } from 'react';

interface Props {
  className?: string;
}

const KeyRegister = ({ className }: Props) => {
  const [isListening, setIsListening] = useState(false);
  const [count, setCount] = useState(0);

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isListening) {
        return;
      }

      setCount(count + 1);

      console.log(`Key pressed: ${event.key}`);
    },
    [isListening],
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keyup', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className={className}>
      {isListening && <div>Listening...</div>}
      {!isListening && (
        <button
          className="btn-primary"
          onClick={() => setIsListening(!isListening)}
        >
          Listen
        </button>
      )}
    </div>
  );
};

export default KeyRegister;
