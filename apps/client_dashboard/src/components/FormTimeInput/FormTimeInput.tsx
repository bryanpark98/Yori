import React, { ChangeEvent } from 'react';
import styles from './FormTimeInput.module.css';

export default function FormTimeInput(props: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
}) {
  const { label, value, placeholder, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <input
      type="time"
      id={label}
      value={value}
      placeholder={placeholder}
      className={styles.input}
      onChange={handleChange}
    />
  );
}
