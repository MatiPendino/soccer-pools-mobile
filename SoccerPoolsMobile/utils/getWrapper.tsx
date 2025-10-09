import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const getWrapper = (): typeof View | typeof GestureHandlerRootView => {
    return Platform.OS === 'web' ? View : GestureHandlerRootView;
};