import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { Router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { getUserInLeague } from '../services/authService';
import { DARK_PURPLE_COLOR, getHowItWorks, MAIN_COLOR } from '../constants';
import Footer from '../components/footer/Footer';
import { useTranslation } from 'react-i18next';
import handleError from 'utils/handleError';
import { removeToken } from 'services/api';
import { getToken } from 'utils/storeToken';
import InitialLoadingScreen from 'components/InitialLoadingScreen';
import HowItWorksCard from './components/HowItWorksCard';
import DownloadApp from './components/DownloadApp';
import Hero from './components/Hero';

// This is crucial for web OAuth to work properly
if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LandingScreen() {
  const [checkingLeague, setCheckingLeague] = useState<boolean>(true);
  const router: Router = useRouter();
  const {t} = useTranslation(); 

  const HOW_IT_WORKS = getHowItWorks(t);

  useEffect(() => {
    const checkUserLeagueStatus = async (token): Promise<void> => {
        try {
          const inLeague = await getUserInLeague(token)
          if (inLeague.in_league) {
            router.replace('/home')
          } else {
            router.replace('/select-league')
          }
        } catch (error) {
          Alert.alert('Error', handleError(error), [{ text: 'OK', onPress: () => {}}], {cancelable: false});
          await removeToken()
        }
    }

    const checkAuth = async (): Promise<void> => {
      const token = await getToken();
      if (!!token) {
        checkUserLeagueStatus(token)
      }
      setCheckingLeague(false);
    }
    
    checkAuth();
  }, []);

  if (checkingLeague) {
    return (
      <InitialLoadingScreen />
    ) 
  }

  return (
    <LinearGradient
      colors={[MAIN_COLOR, DARK_PURPLE_COLOR]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={{paddingHorizontal: Platform.OS === 'web' ? 45 : 7}}>
            <Hero />
 
            {/* HOW TO PLAY */}
            <Text style={styles.howToPlayTxt}>{t('how-to-play')}</Text>
            <View style={styles.cardsWrapper}>
              <View style={styles.columnWrapper}>
                {HOW_IT_WORKS.map(item => (
                  <HowItWorksCard 
                    id={item.id} 
                    icon={item.icon} 
                    title={item.title} 
                    text={item.text} 
                    key={item.id} 
                  />
                ))}
              </View>
            </View>
          </View>

          {/* DOWNLOAD MOBILE APP AND FOOTER, ONLY FOR WEB */}
          {Platform.OS === 'web' && <DownloadApp />}          
          {Platform.OS === 'web' && <Footer />}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 24,
  },
  howToPlayTxt: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: Platform.OS === 'web' ? 24 : 16,
    paddingHorizontal: 10,
  },
  cardsWrapper: {
    gap: 20,
    marginBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});