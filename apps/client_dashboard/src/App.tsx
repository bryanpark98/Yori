import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GlobalStateProvider } from './contexts/GlobalStateContext';
import LoginScreen from './screens/Login/LoginScreen';
import MenusScreen from './screens/Menus/MenusScreen';
import ProductsScreen from './screens/Products/ProductsScreen';
import RestaurantScreen from './screens/Restaurant/RestaurantScreen';
import './styles/colors.css';
import './styles/index.css';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginScreen />
  },
  {
    path: '/restaurant/:restaurantId',
    element: <RestaurantScreen />
  },
  {
    path: '/restaurant/:restaurantId/menus',
    element: <MenusScreen />
  },
  {
    path: '/restaurant/:restaurantId/products',
    element: <ProductsScreen />
  }
]);

function App() {
  return (
    <GlobalStateProvider>
      <RouterProvider router={router} />
    </GlobalStateProvider>
  );
}

export default App;
