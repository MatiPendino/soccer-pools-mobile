import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('accessToken', token.access);
    await AsyncStorage.setItem('refreshToken', token.refresh);
  } catch (e) {
    console.error("Error storing the token", e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (e) {
    console.error("Error retrieving the token", e);
  }
};