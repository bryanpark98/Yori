import styles from './DecorativeButton.module.css';

export default function DecorativeButton(props: { label: string; onClick: () => void }) {
  const { label, onClick } = props;

  return (
    <button onClick={onClick} className={styles.button}>
      {label}
    </button>
  );
}
