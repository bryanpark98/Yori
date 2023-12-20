import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import DecorativeButton from '../../components/DecorativeButton/DecorativeButton';
import DecorativeTextInput from '../../components/DecorativeTextInput/DecorativeTextInput';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Header from '../../components/Header/Header';
import { Authentication } from '../../utils/api';
import styles from './LoginScreen.module.css';

export default function LoginScreen() {
  const [restaurantToken, setRestaurantToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleLogin = async () => {
    try {
      const response = await Authentication.loginWithRestaurantToken(restaurantToken);

      // Assuming the API returns an authentication token
      const authToken = response.token;
      cookies.set('authToken', authToken, { path: '/' });
      console.log('set auth token', authToken);

      navigate(`/restaurant/${response.restaurant.id}`);
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed');
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome back!</h1>
        <DecorativeTextInput
          label="Restaurant admin token"
          value={restaurantToken}
          placeholder="Enter you restaurant admin token..."
          onChange={(text) => {
            setRestaurantToken(text);
            setErrorMessage('');
          }}
        />
        <DecorativeButton label="Log in with token" onClick={handleLogin} />
        <ErrorMessage message={errorMessage} />
      </div>
    </div>
  );
}
