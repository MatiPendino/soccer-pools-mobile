import { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar, ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { getToken } from '../../utils/storeToken';
import { LeagueProps } from '../../types';
import { leagueList } from '../../services/leagueService';
import LeagueCard from './components/LeagueCard';
import Continents from './components/Continents';
import { MAIN_COLOR } from '../../constants';

interface ContinentProps {
    id: number
    name: string
}

const LeagueSelectionScreen = () => {
    const { t } = useTranslation()
    const toast: ToastType = useToast()
    const CONTINENTS_DATA: ContinentProps[] = [
        { id: 6, name: t('all') },
        { id: 0, name: t('americas') },
        { id: 1, name: t('europe')},
        { id: 2, name: t('africa') },
        { id: 3, name: t('asia') },
        { id: 4, name: t('oceania') },
        { id: 5, name: t('tournaments') },
    ];

    const [leagues, setLeagues] = useState<LeagueProps[]>([])
    const [selectedContinent, setSelectedContinent] = useState<ContinentProps>(CONTINENTS_DATA[0])
    const [isLoading, setIsLoading] = useState<boolean>(true)

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4c3b8e" />
      
      <View style={styles.background}>
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
                numColumns={2}
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
  },
  header: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 25
  },
  // Continent FlatList styles
  tabsContainer: {
    marginBottom: 16,
  },
  tabsList: {
    paddingHorizontal: 16,
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