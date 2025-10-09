import { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Entypo } from '@expo/vector-icons';
import { Link, Router, useRouter } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { getToken } from '../../utils/storeToken';
import { LeagueProps, UserCoinsProps } from '../../types';
import { leagueList } from '../../services/leagueService';
import LeagueCard from './components/LeagueCard';
import Continents from './components/Continents';
import { MAIN_COLOR } from '../../constants';
import CoinsDisplay from '../../components/CoinsDisplay';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { userCoinsRetrieve } from '../../services/userService';

interface ContinentProps {
    id: number;
    name: string;
}

const LeagueSelectionScreen = () => {
    const { t } = useTranslation();
    const toast: ToastType = useToast();
    const CONTINENTS_DATA: ContinentProps[] = [
        { id: 6, name: t('all') },
        { id: 5, name: t('tournaments') },
        { id: 0, name: t('americas') },
        { id: 1, name: t('europe')},
        { id: 2, name: t('africa') },
        { id: 3, name: t('asia') },
        { id: 4, name: t('oceania') },
    ];

    const [leagues, setLeagues] = useState<LeagueProps[]>([]);
    const [selectedContinent, setSelectedContinent] = useState<ContinentProps>(CONTINENTS_DATA[0]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [userCoins, setUserCoins] = useState<number>(0);
    const [isLoadingCoins, setIsLoadingCoins] = useState<boolean>(true);
    const router: Router = useRouter();
    const { isLG } = useBreakpoint();

    useEffect(() => {
        const getLeagueList = async (): Promise<void> => {
            try {
                const token = await getToken();
                if (!token) {
                    router.replace('/login');
                    return;
                }
                const leagues: LeagueProps[] = await leagueList(token, selectedContinent.id);
                setLeagues(leagues);
            } catch (error) {
                toast.show('Error authenticating user', {type: 'danger'});
            } finally {
                setIsLoading(false);
            }
        }
        
        getLeagueList();
    }, [selectedContinent]);

  useEffect(() => {
    const getUserCoins = async (): Promise<void> => {
      try {
        const token = await getToken();
        const user: UserCoinsProps = await userCoinsRetrieve(token);
        setUserCoins(user.coins);
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        setIsLoadingCoins(false);
      }
    }
    
    getUserCoins();
  }, []);

  const renderHomeLink = () => {
    // If the user is not loading and has joined at least one league, show the home link
    // Otherwise return an empty view
    if (!isLoading && leagues.some(league => league.is_user_joined)) {
      return (
        <Link href='/home'>
          <Entypo name='chevron-left' color='white' size={30} />
        </Link>
      );
    }

    return <View></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        {renderHomeLink()}

        <View style={{marginEnd: 10}}>
          <CoinsDisplay setCoins={setUserCoins} coins={isLoadingCoins ? '...' : (userCoins || 0)} />
        </View>
      </View>
      
      <View style={styles.background}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isLG && styles.headerTitleLG]}>
            {t('select-league')}
          </Text>
        </View>
        
        <View style={styles.tabsContainer}>
          <FlatList
            data={CONTINENTS_DATA}
            renderItem={({ item }) => (
                <Continents
                    item={item}
                    selectedContinent={selectedContinent}
                    setSelectedContinent={setSelectedContinent}
                />
            )}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsList}
          />
        </View>

        {
            isLoading
            ?
            <ActivityIndicator size='large' color='white' />
            :
            <FlatList
                data={leagues}
                renderItem={({ item }) => (
                    <LeagueCard
                        item={item}
                        setIsLoading={setIsLoading}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                numColumns={isLG ? 4 : 2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.columnWrapper}
            />
        }
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#2F2766',
    flexDirection: 'row',
    paddingVertical: 15,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'web' ? 0 : 20,
    marginBottom: 10,
    paddingHorizontal: 5,
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: MAIN_COLOR
  },
  background: {
    flex: 1,
    width: '100%',
  },
  header: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerTitleLG: {
    fontSize: 36,
  },
  // Continent FlatList styles
  tabsContainer: {
    marginBottom: 16,
  },
  tabsList: {
    paddingHorizontal: 16,
    marginHorizontal: 'auto'
  },
  // League FlatList styles
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default LeagueSelectionScreen;