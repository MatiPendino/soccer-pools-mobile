import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import RoundsPicker from 'components/RoundPicker';
import { Banner } from 'components/ads/Ads';
import RankedPlayersFlatList from '../../components/RankedPlayersFlatList';
import handleShare from '../../utils/handleShare';
import LoadingCards from '../../components/LoadingCards';
import { getWrapper } from '../../utils/getWrapper';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useTournament } from '../../hooks/useTournaments';
import { useRounds } from '../../hooks/useLeagues';
import { useBetLeaders } from '../../hooks/useResults';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { Slug } from '../../types';
import MenuWeb from './components/MenuWeb';
import MenuMobile from './components/MenuMobile';

export default function MyTournament({ }) {
    const { t } = useTranslation();
    const { tournamentId } = useLocalSearchParams();
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);

    const { isXL } = useBreakpoint();
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
    };

    const handleTournamentClick = (pathname: string) => {
        router.push(`${pathname}/${tournamentId}/`);
    };

    const Wrapper = getWrapper();
    const isLoading = isTournamentLoading || isRoundsLoading || (isBetsLoading && !isRefetching);

    return (
        <PaperProvider>
            <Wrapper style={styles.container}>
                {/* Header */}
                <View style={styles.topBar}>
                    <View style={styles.leftSection}>
                        <Pressable
                            onPress={() => router.replace('/home')}
                            style={({ pressed }) => [
                                styles.backButton,
                                pressed && styles.backButtonPressed
                            ]}
                        >
                            <Ionicons name="chevron-back" color={colors.textPrimary} size={24} />
                        </Pressable>

                        <Text style={styles.tntNameTxt} numberOfLines={1}>
                            {tournament ? tournament.name.toUpperCase() : '...'}
                        </Text>
                    </View>

                    {tournament && (
                        !isXL ? (
                            <MenuMobile
                                tournament={tournament}
                                t={t}
                                handleTournamentClick={handleTournamentClick}
                                isMenuVisible={isMenuVisible}
                                setIsMenuVisible={setIsMenuVisible}
                                handleShare={handleShare}
                            />
                        ) : (
                            <MenuWeb
                                tournament={tournament}
                                t={t}
                                handleTournamentClick={handleTournamentClick}
                                handleShare={handleShare}
                            />
                        )
                    )}
                </View>

                {/* Rounds Picker */}
                {(isTournamentLoading || isRoundsLoading) ? (
                    <ShimmerPlaceholder style={styles.roundsListLoading} />
                ) : (
                    <RoundsPicker
                        rounds={rounds || []}
                        handleRoundSwap={handleRoundSwap}
                        activeRoundId={activeRoundId}
                    />
                )}

                {/* Content */}
                {isLoading ? (
                    <LoadingCards cardHeight={80} nCards={5} cardColor={colors.backgroundCard} />
                ) : bets.length > 0 ? (
                    <RankedPlayersFlatList
                        bets={bets}
                        onEnd={loadMore}
                        loadingMore={isFetchingNextPage}
                        refreshing={isRefetching}
                        onRefresh={refetchBets}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="people-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.noBetsTxt}>{t('no-bets')}</Text>
                    </View>
                )}

                <Banner bannerId={process.env.MY_TOURNAMENT_BANNER_ID} />
            </Wrapper>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    topBar: {
        backgroundColor: colors.backgroundElevated,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonPressed: {
        backgroundColor: colors.accent,
    },
    tntNameTxt: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        marginLeft: spacing.md,
        flex: 1,
    },
    roundsListLoading: {
        width: '100%',
        height: 50,
        marginBottom: spacing.lg,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    noBetsTxt: {
        fontSize: typography.fontSize.titleLarge,
        textAlign: 'center',
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
        marginTop: spacing.md,
    },
});