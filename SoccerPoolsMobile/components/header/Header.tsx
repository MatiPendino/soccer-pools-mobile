import { StyleSheet, View, Text, Image } from 'react-native';

export default function Header() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/img/icon-no-bg2.png')}
                style={styles.logo}
                resizeMode='contain'
            />
            <Text style={styles.appNameTxt}>PRODE APP</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center',
        marginVertical: 15
    },
    logo: {
        width: 100,
        height: 100,
    },
    appNameTxt: {
        color: 'white', 
        fontSize: 40, 
        fontWeight: 800, 
        marginStart: 10
    }
});