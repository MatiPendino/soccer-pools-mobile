import { View, Image, ActivityIndicator, StyleSheet } from "react-native"
import { MAIN_COLOR } from "../constants"

export default function InitialLoadingScreen () {

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icon-no-bg.png')}
                style={styles.logoImg}
            />
            <ActivityIndicator color="#ffffff" size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 'auto',
        width: '100%',
        justifyContent: 'center'
    },
    logoImg: {
        marginHorizontal: 'auto',
        width: 250,
        height: 250,
        textAlign: 'center',
        marginBottom: 30
    }
})