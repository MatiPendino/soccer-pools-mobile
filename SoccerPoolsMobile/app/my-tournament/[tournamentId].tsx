import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Slug } from '../../types';
import { Router, useLocalSearchParams } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { PaperProvider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MAIN_COLOR } from '../../constants';
import RankedPlayersFlatList from '../../components/RankedPlayersFlatList';
import handleShare from '../../utils/handleShare';
import { useTranslation } from 'react-i18next';
import RoundsPicker from 'components/RoundPicker';
import { Banner } from 'components/ads/Ads';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LoadingCards from '../../components/LoadingCards';
import { getWrapper } from '../../utils/getWrapper';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import MenuWeb from './components/MenuWeb';
import MenuMobile from './components/MenuMobile';
import { useTournament } from '../../hooks/useTournaments';
import { useRounds } from '../../hooks/useLeagues';
import { useBetLeaders } from '../../hooks/useResults';

export default function MyTournament({ }) {
    const { t } = useTranslation();
    const { tournamentId } = useLocalSearchParams();
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);

    const { isXL } = useBreakpoint();
    const toast: ToastType = useToast();
    const router: Router = useRouter();

    const { 
        data: tournament, isLoading: isTournamentLoading 
    } = useTournament(Number(tournamentId));
    const { data: rounds, isLoading: isRoundsLoading } = useRounds(tournament?.league.id);

    useEffect(() => {
        if (rounds && rounds.length > 0 && activeRoundId === null) {
            setActiveRoundId(rounds[0].id);
        }
    }, [rounds]);

    const activeRound = useMemo(() =>
        rounds?.find(round => round.id === activeRoundId),
        [rounds, activeRoundId]
    );
    const activeRoundSlug = activeRound?.slug;

    const {
        data: betLeadersData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isBetsLoading,
        refetch: refetchBets,
        isRefetching
    } = useBetLeaders(activeRoundSlug, Number(tournamentId));

    const bets = useMemo(() =>
        betLeadersData?.pages.flatMap(page => page.results) || [],
        [betLeadersData]
    );

    const handleRoundSwap = (roundId: number, roundSlug: Slug) => {
        setActiveRoundId(roundId);
    };

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }

    const handleTournamentClick = (pathname: string) => {
        router.push(`${pathname}/${tournamentId}/`);
    }

    const Wrapper = getWrapper();
    const isLoading = isTournamentLoading || isRoundsLoading || (isBetsLoading && !isRefetching);

    return (
        <PaperProvider>
            <Wrapper style={styles.container}>
                <View style={styles.topBar}>
                    <View style={styles.arrowNameContainer}>
                        <Pressable onPress={() => router.replace('/home')}>
                            <Entypo name='chevron-left' color='white' size={30} />   
                        </Pressable>

                        <Text style={styles.tntNameTxt}>
                            {tournament ? tournament.name.toUpperCase() : '...'}
                        </Text>
                    </View>
                    
                    {tournament &&
                        !isXL
                        ?
                        <MenuMobile
                            tournament={tournament}
                            t={t}
                            handleTournamentClick={handleTournamentClick}
                            isMenuVisible={isMenuVisible}
                            setIsMenuVisible={setIsMenuVisible}
                            handleShare={handleShare}
                        />
                        :
                        <MenuWeb
                            tournament={tournament}
                            t={t}
                            handleTournamentClick={handleTournamentClick}
                            handleShare={handleShare}
                        />
                    }
                </View>

                {
                    (isTournamentLoading || isRoundsLoading)
                    ?
                    <ShimmerPlaceholder style={styles.roundsListLoading} />
                    :
                    <RoundsPicker
                        rounds={rounds || []}
                        handleRoundSwap={handleRoundSwap}
                        activeRoundId={activeRoundId}
                    />
                }
                
                {
                    isLoading
                    ?
                    <LoadingCards cardHeight={80} nCards={5} cardColor='#d9d9d9' />
                    :
                        bets.length > 0
                        ?
                        <RankedPlayersFlatList
                            bets={bets}
                            onEnd={loadMore}
                            loadingMore={isFetchingNextPage}
                            refreshing={isRefetching}
                            onRefresh={refetchBets}
                        />
                        :
                        <View><Text style={styles.noBetsTxt}>{t('no-bets')}</Text></View>
                }

                <Banner bannerId={process.env.MY_TOURNAMENT_BANNER_ID} />
            </Wrapper>
        </PaperProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1
    },
    roundsListLoading: { 
        width: '100%', 
        height: 50, 
        marginBottom: 30 
    },
    topBar: {
        backgroundColor: '#2F2766',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        paddingHorizontal: 5
    },
    arrowNameContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
    tntNameTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginStart: 5
    },
    noBetsTxt: {
        fontSize: 27,
        textAlign: 'center',
        color: 'white',
        fontWeight: '500',
        marginBottom: 250
    },
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 7,
        backgroundColor: '#d9d9d9',
        height: 40,
        marginBottom: 15
    },
    roundBtn: {
        marginHorizontal: 15,
        marginVertical: 0,
    },
    roundTxt: {
        fontWeight: '700',
        fontSize: 17
    },
    activeRoundBtn: {
    },
    activeRoundTxt: {
        color: MAIN_COLOR,
        borderBottomColor: MAIN_COLOR,
        borderBottomWidth: 5,
    },
})