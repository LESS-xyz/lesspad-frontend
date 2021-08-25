import React from 'react';

interface Props
  extends Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange'
  > {
  onChange: (value: string) => void;
}

const NumberInput: React.FC<Props> = (props) => {
  const { onChange, ...otherProps } = props;
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    return onChange(value);
  };
  return <input onChange={handleChange} {...otherProps} />;
};

export default NumberInput;
