import { StyleSheet } from 'react-native';
import { MAIN_COLOR } from '../constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 320,
        height: 320
    },
    forgotCreateText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 13
    },
    googleImg: {
        width: 67,
        height: 67,
        marginTop: 30
    }
});
  
export default styles