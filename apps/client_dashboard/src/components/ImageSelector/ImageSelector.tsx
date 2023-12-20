import { ChangeEvent, Component } from 'react';
import { AiFillFileImage } from 'react-icons/ai';
import styles from './ImageSelector.module.css';

interface ImageSelectorProps {
  imageUrl: string | undefined;
  onChange: (image: File) => void;
}

class ImageSelector extends Component<ImageSelectorProps> {
  render() {
    const { imageUrl, onChange } = this.props;

    return (
      <label htmlFor="imageInput" className={styles.imageContainer}>
        {imageUrl ? (
          <img src={imageUrl} className={styles.image} alt="Product" />
        ) : (
          <AiFillFileImage color="#cfcfcf" size={'40%'} />
        )}
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
              onChange(file);
            }
          }}
          style={{ display: 'none' }}
        />
      </label>
    );
  }
}

export default ImageSelector;
