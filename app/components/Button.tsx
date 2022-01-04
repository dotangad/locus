import React from "react";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const TextInput: React.FC<IProps> = ({ children, ...props }: IProps) => {
  return (
    <button
      {...{
        ...props,
        className: `cursor-pointer bg-exun block rounded-lg p-4 text-center uppercase leading-none font-bold text-sm text-white transition outline-exun-light !focus:outline-8 focus:shadow-none disabled:bg-gray-600 disabled:cursor-not-allowed ${props.className}`,
      }}
    >
      {children}
    </button>
  );
};

export default TextInput;
