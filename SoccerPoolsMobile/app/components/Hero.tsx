import { View, Text, StyleSheet, Platform, Image } from 'react-native'
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import GoogleAuthButton from 'components/GoogleAuthButton';
import Header from 'components/header/Header';
import { toCapitalCase } from 'utils/helper';

export default function Hero () {
    const { t } = useTranslation();

    return (
        <View style={styles.hero}>
            <View>
                <Header />

                <Text style={styles.heroTitle}>
                    {t('predict')}{Platform.OS === 'web' ? '\n' : ' '}{t('results')}.{'\n'}{t('climb-leaderboard')}.{'\n'}{t('win-coins')}.
                </Text>

                <Text style={styles.heroSub}>{t('compete-with-friends')}</Text>

                <View style={{paddingHorizontal: Platform.OS === 'web' ? 0 : 10, width: Platform.OS === 'web' ? '80%' : '100%', flexDirection: 'column', justifyContent: 'space-between'}}>
                    <GoogleAuthButton />
                    
                    <Link style={[styles.cta, styles.signUpCta]} href='/create-account'>
                    <Text style={styles.ctaText}>{t('register-now')}</Text>
                    </Link>  

                    <Link style={[styles.cta, styles.logInCta]} href='/login'>
                    <Text style={styles.ctaText}>{toCapitalCase(t('log-in'))}</Text>
                    </Link>  
                </View>
                
            </View>

            {Platform.OS === 'web' &&
                <Image
                    source={require('../../assets/img/wireframe-landing.png')}
                    style={styles.heroImage}
                    resizeMode='contain'
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    hero: {
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'stretch',
    marginBottom: Platform.OS === 'web' ? 48 : 26,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 45 : 32,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 40,
    paddingHorizontal: 10,
  },
  heroSub: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 12,
    width: '90%',
    paddingHorizontal: 10,
  },
  cta: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 24,
    width: Platform.OS === 'web' ? 310 : '100%',
    textAlign: 'center',
  },
  logInCta: {
    backgroundColor: '#F9D651',
    color: '#362B6F',
  },
  signUpCta: {
    backgroundColor: '#603b72a1',
    borderColor: '#452b6fff',
    borderWidth: 3,
    borderStyle: 'dotted',
    color: 'white',
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  heroImage: {
    width: 400,
    height: 570,
    alignSelf: 'center',
    marginTop: 24,
  },
});
