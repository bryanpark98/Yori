import styles from './FormSearchBar.module.css';

export default function FormSearchBar(props: {
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
}) {
  const { placeholder, value, onChange } = props;
  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
