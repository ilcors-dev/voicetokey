import { useAutoAnimate } from '@formkit/auto-animate/react';
import Key from './Key';

interface Props {
  className?: string;
  keys: string[];
}

const KeyCollection = ({ className, keys }: Props) => {
  const [animationParent] = useAutoAnimate();

  return (
    <ul
      ref={animationParent}
      className={`${className} flex flex-wrap items-center space-x-1`}
    >
      {keys.map((key, index) => (
        <div className="flex items-center space-x-1">
          <Key key={index} k={key} />
          {index !== keys.length - 1 && <span>+</span>}
        </div>
      ))}
    </ul>
  );
};

export default KeyCollection;
