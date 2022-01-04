import React from "react";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  error?: string;
}

const TextInput: React.FC<IProps> = ({
  label,
  error,
  containerClassName,
  ...props
}: IProps) => {
  return (
    <div
      className={`input-group text-gray-400 focus-within:text-exun ${containerClassName}`}
    >
      <label
        htmlFor={props.name}
        className="text-xs font-bold uppercase mb-3 transition"
      >
        {label}
      </label>
      <input
        {...{
          ...props,
          className: `border-2 border-gray-bg focus:border-exun focus:outline-none rounded-lg p-3 w-full transition text-gray-800 ${props.className}`,
        }}
      />
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default TextInput;
