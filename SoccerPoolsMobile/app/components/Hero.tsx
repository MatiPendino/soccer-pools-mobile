import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link, useLocalSearchParams } from 'expo-router';
import GoogleAuthButton from 'components/GoogleAuthButton';
import Header from 'components/header/Header';
import { toCapitalCase } from 'utils/helper';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function Hero () {
    const { t } = useTranslation();
    const { referralCode } = useLocalSearchParams();
    const { isLG, isXL, isXXL } = useBreakpoint();

    const heroImageSize = () => {
      if (isXXL) {
        return {width: 650, height: 845}
      } else if (isXL) {
        return {width: 500, height: 650}
      } 

      return {width: 400, height: 570}
    }

    return (
        <View style={styles.hero}>
            <View style={{width: isLG ? '50%' : '100%'}}>
                <Header />

                <Text style={styles.heroTitle}>
                    {t('predict')}{Platform.OS === 'web' ? '\n' : ' '}{t('results')}.{'\n'}{t('climb-leaderboard')}.{'\n'}{t('win-coins')}.
                </Text>

                <Text style={styles.heroSub}>{t('compete-with-friends')}</Text>

                <View 
                  style={[styles.btnsContainer,
                    { paddingHorizontal: isLG ? 0 : 10, width: isLG ? '80%' : '100%' }
                  ]}
                >
                    <GoogleAuthButton 
                      referralCode={referralCode ? referralCode : ''} 
                      callingRoute='home' 
                    />
                    
                    <Link 
                      style={[styles.cta, styles.signUpCta, {width: isLG ? 310 : '100%'}]} 
                      href={`/create-account?referralCode=${referralCode ? referralCode : ''}`}
                    >
                      <Text style={styles.ctaText}>{t('register-now')}</Text>
                    </Link>  

                    <Link 
                      style={[styles.cta, styles.logInCta, {width: isLG ? 310 : '100%'}]} 
                      href={`/login?referralCode=${referralCode ? referralCode : ''}`}
                    >
                      <Text style={styles.ctaText}>{toCapitalCase(t('log-in'))}</Text>
                    </Link>  

                    {Platform.OS === 'web' &&
                      <Link 
                        style={[styles.cta, styles.signUpCta, {width: isLG ? 310 : '100%'}]} 
                        href={`/prizes?referralCode=${referralCode ? referralCode : ''}`}
                      >
                        <Text style={styles.ctaText}>{toCapitalCase(t('see-prizes'))}</Text>
                      </Link> 
                    }
                </View>
                
            </View>

            {isLG &&
                <Image
                    source={require('../../assets/img/hero.png')}
                    style={[styles.heroImage, {width: heroImageSize().width, height: heroImageSize().height}]}
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
  btnsContainer: {
    flexDirection: 'column', 
    gap: 10
  },
  cta: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
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
  prizesCta: {
    backgroundColor: 'orange',
    borderColor: '#a45a0aff',
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
    alignSelf: 'center',
    marginTop: 24,
  },
});
