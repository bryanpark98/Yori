import { AiFillFileImage } from 'react-icons/ai';
import styles from './FormImage.module.css';

export default function FormImage(props: { imageUrl?: string }) {
  const { imageUrl } = props;

  return (
    <div className={styles.imageContainer}>
      {imageUrl ? (
        <img src={imageUrl} className={styles.image} alt="Product" />
      ) : (
        <AiFillFileImage color="#cfcfcf" size={'40%'} />
      )}
    </div>
  );
}
