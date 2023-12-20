import styles from './FormFieldContainer.module.css';

/**
 * Used to wrap form fields (label input pairs) to ensure consistent spacing.
 */
export default function FormFieldContainer(props: { children: React.ReactNode }) {
  return <div className={styles.container}>{props.children}</div>;
}
