import React, { ChangeEvent, useState } from 'react';
import styles from './FormTextArea.module.css';
import FormLabel from '../FormLabel/FormLabel';
import { v4 as uuidv4 } from 'uuid';
import FormFieldContainer from '../../containers/FormFieldContainer/FormFieldContainer';

export default function FormTextArea(props: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
}) {
  const uniqueId = useState(uuidv4())[0];
  const { label, value, placeholder, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormFieldContainer>
      <FormLabel label={label} htmlFor={uniqueId} />
      <textarea
        rows={4}
        id={uniqueId}
        value={value}
        placeholder={placeholder}
        className={styles.input}
        onChange={handleChange}
      />
    </FormFieldContainer>
  );
}
