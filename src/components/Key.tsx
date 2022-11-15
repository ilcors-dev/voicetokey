interface Props {
  className?: string;
  k: string;
}

const Key = ({ className, k }: Props) => {
  return (
    <div
      className={`${className} flex min-w-[28px] items-center justify-center rounded bg-gray-200 px-2 py-1 text-sm font-bold uppercase leading-tight shadow`}
    >
      {k}
    </div>
  );
};

export default Key;
