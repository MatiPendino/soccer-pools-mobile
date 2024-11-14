import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getToken() {
    const token = await AsyncStorage.getItem('accessToken');
    return token
}