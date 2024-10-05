import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#6860A1',
        height: '100%'
    },
    container: {
        width: '100%',
        flex: 1,
        marginHorizontal: 'auto',
        marginTop: 50,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 0,
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
    }
})

export default styles