import { useState, useEffect } from 'react';
import Select from 'react-select';
import { usePpn } from '../composables/usePpn';

export interface Ppn {
  name: string;
  path: string;
}

interface Props {
  wakeWord?: string;
  setSelected: (path: string) => void;
}

interface SelectOption {
  label: string;
  value: string;
}

const WakeWordSelector = ({ wakeWord, setSelected }: Props) => {
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    (async () => {
      const list = await usePpn().list();

      setOptions(
        list.map((ppn, i) => ({
          // get last part of path (filename)
          label: ppn.split('\\').pop() ?? '',
          value: ppn,
        })),
      );
    })();
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute z-10 w-full">
        <Select
          styles={{
            control: (provided, state) => ({
              display: 'flex',
              position: 'relative',
              flexWrap: 'wrap',
              alignItems: 'center',
              borderRadius: '0.25rem',
              borderBottom: '1px solid #000',
            }),
            menu: (provided, state) => ({
              border: '1px solid #000',
              borderRadius: '0.25rem',
              background: '#fff',
            }),
          }}
          value={options.find(o => o.value === wakeWord)}
          options={options}
          onChange={option => option && setSelected(option.value)}
        />
      </div>
    </div>
  );
};

export default WakeWordSelector;
