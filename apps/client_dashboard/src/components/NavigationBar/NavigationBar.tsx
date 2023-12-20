import styles from './NavigationBar.module.css';
import { Link, useParams } from 'react-router-dom';

export enum NavigationBarPage {
  General = 'General',
  Menus = 'Menus',
  Products = 'Products'
}

export default function NavigationBar(props: { activePage: NavigationBarPage }) {
  const { activePage } = props;
  const { restaurantId } = useParams();

  const pageLinks = {
    [NavigationBarPage.General]: `/restaurant/${restaurantId}`,
    [NavigationBarPage.Menus]: `/restaurant/${restaurantId}/menus`,
    [NavigationBarPage.Products]: `/restaurant/${restaurantId}/products`
  };

  function NavigationBarButton(props: { page: NavigationBarPage }) {
    const { page } = props;
    const active = activePage === page;

    return (
      <Link
        to={pageLinks[page]}
        className={active ? [styles.button, styles.buttonActive].join(' ') : styles.button}>
        {page}
      </Link>
    );
  }

  return (
    <div className={styles.container}>
      <NavigationBarButton page={NavigationBarPage.General} />
      <NavigationBarButton page={NavigationBarPage.Menus} />
      <NavigationBarButton page={NavigationBarPage.Products} />
    </div>
  );
}
