import styles from './FormLabel.module.css';

export default function FormLabel(props: { label: string; htmlFor?: string }) {
  const { label, htmlFor } = props;
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {label}
    </label>
  );
}
