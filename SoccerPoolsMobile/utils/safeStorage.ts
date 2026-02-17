import AsyncStorage from '@react-native-async-storage/async-storage';

export const safeGetItem = async (key: string): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(key);
    } catch {
        return null;
    }
};

export const safeSetItem = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch {
        // localStorage unavailable (for example Safari Private Browsing). Ignore
    }
};

export const safeRemoveItem = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch {
        // localStorage unavailable. Ignore
    }
};
