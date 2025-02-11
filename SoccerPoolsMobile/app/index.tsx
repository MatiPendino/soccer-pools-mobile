import { useState, useEffect } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { useRouter } from 'expo-router';
import Login from '../screens/Login';
import { getUserInLeague } from '../services/authService';
import { getToken } from '../utils/storeToken';
import { removeToken } from '../services/api';
import InitialLoadingScreen from '../components/InitialLoadingScreen';

export default function App() {
  const toast = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string>(null)
  const [checkingLeague, setCheckingLeague] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      const token = await getToken()
      setIsAuthenticated(!!token);
      if (!!token) {
        setToken(token)
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const checkUserLeagueStatus = async (): Promise<void> => {
      if (isAuthenticated) {
        try {
          const inLeague = await getUserInLeague(token)
          if (inLeague.in_league) {
            router.replace('/home')
          } else {
            router.replace('/select-league')
          }
        } catch (error) {
          toast.show('Error checking league status', { type: 'danger' })
          await removeToken()
        } finally {
          setCheckingLeague(false)
        }
      }
    }
    checkUserLeagueStatus()
  }, [isAuthenticated, token])

  if (!isAuthenticated) {
    return <Login />
  }

  if (checkingLeague) {
    return (
      <InitialLoadingScreen />
    ) 
  }

  return null
}
