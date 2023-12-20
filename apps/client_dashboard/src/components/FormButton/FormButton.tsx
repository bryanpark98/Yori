import styles from './FormButton.module.css';
import { Dots } from 'react-activity';
import 'react-activity/dist/library.css';

export default function FormButton(props: {
  text: string;
  loading?: boolean;
  floating?: boolean;
  error?: string;
  onClick: () => void;
}) {
  const { text, loading, floating, error, onClick } = props;

  return (
    <div className={floating ? styles.floatingContainer : ''}>
      {error && <div className={styles.error}>{error}</div>}
      <button
        onClick={onClick}
        className={`${styles.button} ${floating ? styles.floatingButton : ''}`}>
        <div style={{ opacity: loading ? 0 : 1 }}>{text}</div>
        <div className={styles.activityIndicator} style={{ opacity: loading ? 1 : 0 }}>
          <Dots />
        </div>
      </button>
    </div>
  );
}
