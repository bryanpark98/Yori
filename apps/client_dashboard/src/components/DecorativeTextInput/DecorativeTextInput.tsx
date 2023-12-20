import React, { ChangeEvent } from 'react';
import styles from './DecorativeTextInput.module.css';

export default function DecorativeTextInput(props: {
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
    <div className={styles.container}>
      <label className={styles.label} htmlFor={label}>
        {label}
      </label>
      <input
        type="text"
        id={label}
        value={value}
        placeholder={placeholder}
        className={styles.input}
        onChange={handleChange}
      />
    </div>
  );
}
