import React, { ChangeEvent, useState } from 'react';
import styles from './FormTextInput.module.css';
import FormLabel from '../FormLabel/FormLabel';
import { v4 as uuidv4 } from 'uuid';
import FormFieldContainer from '../../containers/FormFieldContainer/FormFieldContainer';

export default function FormTextInput(props: {
  value: string;
  placeholder?: string;
  label?: string;
  onChange: (newValue: string) => void;
}) {
  const { label, value, placeholder, onChange } = props;
  const uniqueId = useState(uuidv4())[0];

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <FormFieldContainer>
      {label && <FormLabel label={label} htmlFor={uniqueId} />}
      <input
        type="text"
        id={uniqueId}
        value={value}
        placeholder={placeholder}
        className={styles.input}
        onChange={handleChange}
      />
    </FormFieldContainer>
  );
}
