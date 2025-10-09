import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('accessToken', token.access);
    await AsyncStorage.setItem('refreshToken', token.refresh);
  } catch (error) {
    Sentry.captureException(error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    Sentry.captureException(error);
  }
};