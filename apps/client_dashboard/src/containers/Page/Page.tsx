import Header from '../../components/Header/Header';
import NavigationBar, { NavigationBarPage } from '../../components/NavigationBar/NavigationBar';
import styles from './Page.module.css';

export default function Page(props: { activePage: NavigationBarPage; children: React.ReactNode }) {
  const { activePage, children } = props;

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.navBarContainer}>
          <NavigationBar activePage={activePage} />
        </div>
        <div className={styles.page}>{children}</div>
      </div>
    </div>
  );
}
