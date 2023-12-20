import styles from './Modal.module.css';
import { IoCloseSharp } from 'react-icons/io5';

export default function Modal(props: {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  visible?: boolean;
}) {
  const { title } = props;

  const visible = props.visible ?? true;

  if (!visible) {
    return null;
  }
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        {title && (
          <div style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
            <div className={styles.header}>
              <h3>{title}</h3>
            </div>
          </div>
        )}
        <div className={styles.button} onClick={props.onClose}>
          <IoCloseSharp size={24} />
        </div>
        <div className={styles.content} style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
