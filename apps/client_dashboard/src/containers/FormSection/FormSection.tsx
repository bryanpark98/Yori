import styles from './FormSection.module.css';

export default function FormSection(props: { children: React.ReactNode }) {
  return <div className={styles.container}>{props.children}</div>;
}
