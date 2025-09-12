import { View, Text, Image, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router'
import { ANDROID_URL } from '../../constants'
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function DownloadApp () {
    const { t } = useTranslation();
    const { isLG, isXL, isXXL } = useBreakpoint();

    const downloadImageSize = () => {
      if (isXXL) {
            return {width: 600, height: 600}
      } else if (isXL) {
            return {width: 450, height: 450}
      } 

      return {width: 340, height: 340}
    }

    return (
        <View 
            style={[styles.container, { flexDirection: isLG ? 'row' : 'column' }]}
        >
            <Image
                source={require('../../assets/img/download_app.png')}
                style={[
                    styles.wireframeImg, 
                    {
                        marginHorizontal: isLG ? 0 : 'auto', 
                        width: downloadImageSize().width, 
                        height: downloadImageSize().height
                    }
                ]}
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
        justifyContent: 'center', 
        gap: 20,
        marginBottom: 40,
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