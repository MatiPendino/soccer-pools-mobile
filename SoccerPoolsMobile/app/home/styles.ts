import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%',
    },
    drawerNavbar: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#6860A1',
        color: '#fff'
    },
    nameTxt: {
        marginTop: 10,
        color: 'white',
        fontSize: 18
    },
    emailTxt: {
        marginVertical: 10,
        color: 'white',
        fontSize: 15
    },
    editBtn: {
        fontWeight: '500'
    },
    editTxt: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    instaContainer: {
        marginHorizontal: 'auto',
        marginTop: 280
    },
    logoutBtn: {
        backgroundColor: '#6860A1', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 5,
        marginTop: 40
    },
    logoutTxt: {
        color: 'white',
        marginStart: 5,
        fontWeight: '600',
        fontSize: 17
    }
})

export default styles