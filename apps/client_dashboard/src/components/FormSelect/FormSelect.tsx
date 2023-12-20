import { useState } from 'react';
import FormLabel from '../FormLabel/FormLabel';
import styles from './FormSelect.module.css';
import { v4 as uuidv4 } from 'uuid';
import FormFieldContainer from '../../containers/FormFieldContainer/FormFieldContainer';

export default function FormSelect(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (newValue: string) => void;
}) {
  const uniqueId = useState(uuidv4())[0];
  const { label, value, options, onChange } = props;
  return (
    <FormFieldContainer>
      <FormLabel label={label} htmlFor={uniqueId} />
      <div>
        <div className={styles.selectContainer}>
          <select
            id={uniqueId}
            className={styles.select}
            value={value}
            onChange={(event) => onChange(event.target.value)}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </FormFieldContainer>
  );
}
