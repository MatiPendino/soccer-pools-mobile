import { useEffect } from 'react';
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { Router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { DARK_PURPLE_COLOR, getHowItWorks, MAIN_COLOR } from '../constants';
import Footer from '../components/footer/Footer';
import { useTranslation } from 'react-i18next';
import InitialLoadingScreen from 'components/InitialLoadingScreen';
import { useBreakpoint } from '../hooks/useBreakpoint';
import HowItWorksCard from './components/HowItWorksCard';
import DownloadApp from './components/DownloadApp';
import Hero from './components/Hero';
import { useUser } from '../hooks/useUser';
import { useUserLeague } from '../hooks/useLeagues';

// This is crucial for web OAuth to work properly
if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LandingScreen() {
  const { isLG } = useBreakpoint();
  const router: Router = useRouter();
  const {t} = useTranslation(); 

  const HOW_IT_WORKS = getHowItWorks(t);

  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: league, isLoading: isLeagueLoading } = useUserLeague();

  useEffect(() => {
    if (user) {
      if (league && league.id) {
        router.replace('/home');
      } else if (!isLeagueLoading) {
        router.replace('/select-league');
      }
    }
  }, [user, league, isLeagueLoading]);

  if (isUserLoading || (user && isLeagueLoading)) {
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
          <View style={{paddingHorizontal: isLG ? 45 : 7}}>
            <Hero />
 
            {/* HOW TO PLAY */}
            <Text style={[styles.howToPlayTxt, {marginBottom: isLG ? 24 : 16}]}>
              {t('how-to-play')}
            </Text>
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