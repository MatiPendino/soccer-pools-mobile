import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../screens/Login';
import { getUserInLeague } from '../services/authService';

export default function App() {
  const toast = useToast()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null)
  const [checkingLeague, setCheckingLeague] = useState(true);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    return token
  }

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken()
      setIsAuthenticated(!!token);
      if (!!token) {
        setToken(token)
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const checkUserLeagueStatus = async () => {
      if (isAuthenticated) {
        try {
          console.log(token)
          const inLeague = await getUserInLeague(token)
          if (inLeague) {
            router.replace('/home')
          } else {
            router.replace('/select-tournament')
          }
        } catch (error) {
          toast.show('Error checking league status', { type: 'danger' });
        } finally {
          setCheckingLeague(false)
        }
      }
    }
    checkUserLeagueStatus()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Login />
  }

  if (checkingLeague) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  return null
}
