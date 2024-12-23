import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
    },
    drawerNavbar: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#6860A1',
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
    },
    editTxt: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    itemsContainer: {
        paddingHorizontal: 10,
        marginTop: 50
    },
    instaContainer: {
        marginHorizontal: 'auto',
        marginTop: 200
    },
    logoutBtn: {
        backgroundColor: '#2F2766', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        marginTop: 40,
        borderRadius: 10
    },
    logoutTxt: {
        color: 'white',
        marginStart: 5,
        fontWeight: '600',
        fontSize: 17,
    }
})

export default styles