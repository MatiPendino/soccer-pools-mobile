import { View, Text, Image, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router'
import { ANDROID_URL } from '../../constants'

export default function DownloadApp () {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/img/wireframe_mobile.png')}
                style={styles.wireframeImg}
                resizeMode='contain'
            />

            <View style={{justifyContent: 'center'}}>
                <Text style={styles.accessFromAppTxt}>{t('access-from-app')}</Text>
                <Text style={styles.usersDownloadTxt}>{t('users-download-and-access')}</Text>
                <Link href={ANDROID_URL} style={styles.link} target='_blank'>
                    <Image 
                        source={require('../../assets/img/get-it-on-google-play.png')}
                        style={styles.googlePlayImg}
                        resizeMode='contain'
                    />
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        gap: 20
    },
    wireframeImg: {
        width: 340,
        height: 340,
    },
    accessFromAppTxt: {
        fontWeight: 'bold', 
        fontSize: 40, 
        textAlign: 'center', 
        marginTop: 15, 
        color: 'white'
    },
    usersDownloadTxt: {
        fontSize: 20, 
        textAlign: 'center', 
        color: 'white'
    },
    link: {
        textAlign: 'center', 
        marginTop: 40
    },
    googlePlayImg: {
        width: 170,
        height: 60
    },
})