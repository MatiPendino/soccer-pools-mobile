import { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Entypo } from '@expo/vector-icons';
import { Link, Router, useRouter } from 'expo-router';
import LeagueCard from './components/LeagueCard';
import Continents from './components/Continents';
import { MAIN_COLOR } from '../../constants';
import CoinsDisplay from '../../components/CoinsDisplay';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useLeagues } from '../../hooks/useLeagues';
import { useUserCoins } from '../../hooks/useUser';

interface ContinentProps {
    id: number;
    name: string;
}

const LeagueSelectionScreen = () => {
    const { t } = useTranslation();
    const CONTINENTS_DATA: ContinentProps[] = [
        { id: 6, name: t('all') },
        { id: 5, name: t('tournaments') },
        { id: 0, name: t('americas') },
        { id: 1, name: t('europe')},
        { id: 2, name: t('africa') },
        { id: 3, name: t('asia') },
        { id: 4, name: t('oceania') },
    ];

  const [selectedContinent, setSelectedContinent] = useState<ContinentProps>(CONTINENTS_DATA[0]);
  const { isLG } = useBreakpoint();

  const { data: leagues, isLoading: isLeaguesLoading } = useLeagues(selectedContinent.id);
  const { data: userCoins, isLoading: isCoinsLoading } = useUserCoins();

  const renderHomeLink = () => {
    // If the user is not loading and has joined at least one league, show the home link
    // Otherwise return an empty view
    if (!isLeaguesLoading && leagues && leagues.some(league => league.is_user_joined)) {
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
          <CoinsDisplay coins={isCoinsLoading ? '...' : (userCoins?.coins || 0)} />
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
          isLeaguesLoading
            ?
            <ActivityIndicator size='large' color='white' />
            :
            <FlatList
                data={leagues}
                renderItem={({ item }) => (
                    <LeagueCard
                        item={item}
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