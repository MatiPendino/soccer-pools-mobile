import { StyleSheet } from "react-native";
import { MAIN_COLOR } from "../../constants";

const styles = StyleSheet.create({
    container: {
    },
    drawerNavbar: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: MAIN_COLOR,
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
        marginTop: 30
    },
    socialMediaContainer: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 50,
        justifyContent: 'space-around'
    },
    socialMediaBtn: {},
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
    },
    shareBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    shareTxt: {
        color: "white",
        fontSize: 24,
        marginLeft: 10,
        fontWeight: '600'
    },
})

export default styles