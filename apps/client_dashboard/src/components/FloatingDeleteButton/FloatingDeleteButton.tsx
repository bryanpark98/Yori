import { IoCloseSharp } from 'react-icons/io5';
import styles from './FloatingDeleteButton.module.css';

export default function FloatingDeleteButton(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <IoCloseSharp color="black" size={'75%'} onClick={onClick} />
      </div>
    </div>
  );
}
