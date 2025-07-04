import { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, ActivityIndicator, Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import * as Sentry from '@sentry/react-native';
import { getToken } from '../../utils/storeToken';
import { LeagueProps, UserProps } from '../../types';
import { leagueList } from '../../services/leagueService';
import LeagueCard from './components/LeagueCard';
import Continents from './components/Continents';
import { MAIN_COLOR } from '../../constants';
import { getFullUser } from '../../services/authService';
import CoinsDisplay from '../../components/CoinsDisplay';

interface ContinentProps {
    id: number
    name: string
}

const LeagueSelectionScreen = () => {
    const { t } = useTranslation()
    const toast: ToastType = useToast()
    const CONTINENTS_DATA: ContinentProps[] = [
        { id: 6, name: t('all') },
        { id: 5, name: t('tournaments') },
        { id: 0, name: t('americas') },
        { id: 1, name: t('europe')},
        { id: 2, name: t('africa') },
        { id: 3, name: t('asia') },
        { id: 4, name: t('oceania') },
    ];

    const [leagues, setLeagues] = useState<LeagueProps[]>([])
    const [selectedContinent, setSelectedContinent] = useState<ContinentProps>(CONTINENTS_DATA[0])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [userCoins, setUserCoins] = useState<number>(0)
    const [isLoadingCoins, setIsLoadingCoins] = useState<boolean>(true)

    useEffect(() => {
        const getLeagueList = async (): Promise<void> => {
            try {
                const token = await getToken()
                const leagues: LeagueProps[] = await leagueList(token, selectedContinent.id)
                setLeagues(leagues)
            } catch (error) {
                toast.show('Error authenticating user', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        
        getLeagueList()
    }, [selectedContinent])

  useEffect(() => {
    const getUserCoins = async (): Promise<void> => {
      try {
        const token = await getToken()
        const user: UserProps = await getFullUser(token)
        setUserCoins(user.coins)
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        setIsLoadingCoins(false)
      }
    }
    
    getUserCoins()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4c3b8e" />
      
      <View style={styles.background}>
        <View style={{marginEnd: 10}}>
          <CoinsDisplay setCoins={setUserCoins} coins={isLoadingCoins ? '...' : (userCoins || 0)} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>{t('select-league')}</Text>
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
            <ActivityIndicator size="large" color="white" />
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
                numColumns={Platform.OS === 'web' ? 4 : 2}
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
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: MAIN_COLOR,
    paddingTop: 40,
  },
  header: {
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 5
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