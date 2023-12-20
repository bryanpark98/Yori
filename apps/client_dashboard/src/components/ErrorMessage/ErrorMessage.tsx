import styles from './ErrorMessage.module.css';

export default function ErrorMessage(props: { message: string }) {
  const { message } = props;

  return <div className={styles.container}>{message}</div>;
}
