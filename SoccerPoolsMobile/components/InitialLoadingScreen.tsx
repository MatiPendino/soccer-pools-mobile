import { View, Image, ActivityIndicator, StyleSheet } from "react-native"

export default function InitialLoadingScreen () {

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/splash.png')}
                style={styles.logoImg}
            />
            <ActivityIndicator color="#ffffff" size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
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