import { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Router, useRouter } from 'expo-router';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useTournaments } from '../../../hooks/useTournaments';
import { useUserLeague } from '../../../hooks/useLeagues';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import TournamentCard from '../components/TournamentCard';

export default function Tournaments() {
    const { t } = useTranslation();
    const [tournamentLookup, setTournamentLookup] = useState<string>('');
    const { isLG } = useBreakpoint();
    const router: Router = useRouter();

    const { data: league, isLoading: isLeagueLoading } = useUserLeague();
    const { data: tournaments, isLoading: isTournamentsLoading } = useTournaments(
        league?.id,
        tournamentLookup
    );

    const isLoading: boolean = isLeagueLoading || isTournamentsLoading;

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Ionicons name="trophy-outline" size={80} color={colors.textMuted} />
            <Text style={styles.noTournamentTxt}>{t('not-tournament-yet')}</Text>
            <Text style={styles.emptyStateSubtitle}>{t('create-tournament-tapping-button')}</Text>
        </View>
    );

    const renderLoader = () => (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loaderText}>{t('loading-tournaments')}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('tournaments')}</Text>
            </View>

            <View style={styles.inputContainer}>
                <Ionicons 
                    name="search-outline" 
                    size={20} 
                    color={colors.textMuted} 
                    style={styles.lookUpIcon} 
                />
                <TextInput
                    placeholder={t('look-for-tournament')}
                    style={styles.lookTntInput}
                    value={tournamentLookup}
                    onChangeText={setTournamentLookup}
                    placeholderTextColor={colors.textMuted}
                    selectionColor={colors.accent}
                />
                {tournamentLookup.length > 0 && (
                    <Pressable onPress={() => setTournamentLookup('')} style={styles.clearIcon}>
                        <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                    </Pressable>
                )}
            </View>

            {isLoading ? (
                renderLoader()
            ) : tournaments && tournaments.length > 0 ? (
                <ScrollView
                    contentContainerStyle={[
                        styles.tournamentsContainer,
                        { width: isLG ? '60%' : '100%' },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {tournaments.map((tournament) => (
                        <TournamentCard
                            key={tournament.id}
                            name={tournament.name}
                            logoUrl={tournament.logo}
                            adminUsername={tournament.admin_tournament.username}
                            adminEmail={tournament.admin_tournament.email}
                            nParticipants={tournament.n_participants}
                            tournamentId={tournament.id}
                            leagueId={tournament.league.id}
                        />
                    ))}
                </ScrollView>
            ) : (
                renderEmptyState()
            )}

            <FloatingAction
                actions={[]}
                onOpen={() => {
                    router.push({ pathname: 'create-tournament', params: { leagueId: league?.id } });
                }}
                color={colors.accent}
                iconHeight={24}
                iconWidth={24}
                buttonSize={60}
                distanceToEdge={16}
                overlayColor={colors.overlay}
                shadow={{
                    shadowColor: colors.accent,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
    },
    header: {
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    headerTitle: {
        fontSize: typography.fontSize.headlineLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    lookTntInput: {
        flex: 1,
        fontSize: typography.fontSize.bodyMedium,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        color: colors.textPrimary,
        ...(Platform.OS === 'web' && { outlineStyle: 'none' }),
    },
    lookUpIcon: {
        marginRight: spacing.xs,
    },
    clearIcon: {
        padding: spacing.xs,
    },
    tournamentsContainer: {
        paddingBottom: 100,
        marginHorizontal: 'auto',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        marginTop: -60,
    },
    noTournamentTxt: {
        fontSize: typography.fontSize.titleLarge,
        textAlign: 'center',
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semibold,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    emptyStateSubtitle: {
        fontSize: typography.fontSize.bodyMedium,
        textAlign: 'center',
        color: colors.textSecondary,
        lineHeight: 22,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -60,
    },
    loaderText: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
});
