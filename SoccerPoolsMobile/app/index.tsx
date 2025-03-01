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
  const [checkingLeague, setCheckingLeague] = useState<boolean>(true);

  useEffect(() => {
    const checkUserLeagueStatus = async (token): Promise<void> => {
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

    const checkAuth = async (): Promise<void> => {
      const token = await getToken()
      setIsAuthenticated(!!token);
      if (!!token) {
        checkUserLeagueStatus(token)
      }
    }
    
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Login />
  }

  if (checkingLeague) {
    return (
      <InitialLoadingScreen />
    ) 
  }

  return <InitialLoadingScreen />
}
