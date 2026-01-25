import { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator, Platform, Pressable
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import CoinsDisplay from '../../components/CoinsDisplay';
import { PageHeader } from '../../components/ui';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useLeagues } from '../../hooks/useLeagues';
import { useUserCoins } from '../../hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { ContinentProps } from '../../types';
import LeagueCard from './components/LeagueCard';
import Continents from './components/Continents';

const LeagueSelectionScreen = () => {
    const { t } = useTranslation();
    const CONTINENTS_DATA: ContinentProps[] = [
        { id: 6, name: t('all') },
        { id: 5, name: t('tournaments') },
        { id: 0, name: t('americas') },
        { id: 1, name: t('europe') },
        { id: 2, name: t('africa') },
        { id: 3, name: t('asia') },
        { id: 4, name: t('oceania') },
    ];

    const [selectedContinent, setSelectedContinent] = useState<ContinentProps>(CONTINENTS_DATA[0]);
    const { isLG } = useBreakpoint();

    const { data: leagues, isLoading: isLeaguesLoading } = useLeagues(selectedContinent.id);
    const { data: userCoins, isLoading: isCoinsLoading } = useUserCoins();

    const renderHomeLink = () => {
        if (!isLeaguesLoading && leagues && leagues.some(league => league.is_user_joined)) {
            return (
                <Link href="/home" asChild>
                    <Pressable style={styles.backButton}>
                        <Ionicons name="chevron-back" color={colors.textPrimary} size={24} />
                    </Pressable>
                </Link>
            );
        }
        return <View style={{ width: 40 }} />;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.topBar}>
                {renderHomeLink()}

                <Text style={styles.topBarTitle}>{t('select-league')}</Text>

                <View style={styles.coinsWrapper}>
                    <CoinsDisplay coins={isCoinsLoading ? '...' : (userCoins?.coins || 0)} />
                </View>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.sectionHeader}>
                    <PageHeader
                        badgeIcon="trophy-outline"
                        badgeText={t('choose-your-league')}
                        title={t('select-league')}
                    />
                </View>

                {/* Continent Tabs */}
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

                {/* Leagues Grid */}
                {isLeaguesLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.accent} />
                        <Text style={styles.loaderText}>{t('loading')}...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={leagues}
                        renderItem={({ item }) => <LeagueCard item={item} />}
                        keyExtractor={item => item.id.toString()}
                        numColumns={isLG ? 4 : 2}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center'
    },
    topBar: {
        backgroundColor: colors.backgroundElevated,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBarTitle: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    coinsWrapper: {
        minWidth: 80,
    },
    content: {
        flex: 1,
        paddingTop: spacing.lg,
    },
    sectionHeader: {
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    tabsContainer: {
        marginBottom: spacing.lg,
        justifyContent: 'center',
    },
    tabsList: {
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        flexGrow: 1,
        justifyContent: 'center',
    },
    listContainer: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xxl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
        marginTop: spacing.md,
    },
});

export default LeagueSelectionScreen;