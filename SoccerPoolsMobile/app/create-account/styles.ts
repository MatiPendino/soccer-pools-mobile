import { StyleSheet } from "react-native"
import { MAIN_COLOR } from "../../constants"

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: MAIN_COLOR,
        marginHorizontal: 'auto',
        paddingHorizontal: 10,
        paddingTop: 35,
        paddingBottom: 15,
        borderRadius: 6
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    createTxt: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginHorizontal: 50,
        textAlign: 'center'
    },
    googleBtn: {
        backgroundColor: '#AA962C',
        borderRadius: 10,
        width: 270,
        marginVertical: 20
    },
    googleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    googleTxt: {
        color: '#fff',
        fontWeight: 'bold',
        marginEnd: 8,
        fontSize: 17
    },
    googleImg: {
        width: 42,
        height: 42
    },
    separationContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    whiteLine: {
        width: '40%',
        height: 1,
        marginVertical: 'auto',
        backgroundColor: '#c2c2c2'
    },
    orTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
        marginBottom: 20
    },
    alreadyTxt: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic'
    },
    googleContainerDisabled: {
        opacity: 0.5,
    },
    googleImgDisabled: {
        opacity: 0.5,
    },
})

export default styles