import { useEffect, useState, useMemo } from 'react';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Pressable, StyleSheet, ActivityIndicator, ScrollView, View } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { showOpenAppAd } from 'components/ads/Ads';
import RoundsPicker from 'components/RoundPicker';
import SaveChanges from '../../../modals/SaveChanges';
import PaymentRequiredModal from '../../../components/PaymentRequiredModal';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import { getToken } from '../../../utils/storeToken';
import { MatchResultProps, Slug } from '../../../types';
import { getNextRoundId } from '../../../utils/getNextRound';
import handleError from '../../../utils/handleError';
import { registerPush, getFCMToken } from '../../../services/pushNotificationService';
import { getWrapper } from '../../../utils/getWrapper';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useUserLeague, useRounds } from '../../../hooks/useLeagues';
import { useMatchResults, useUpdateMatchResults } from '../../../hooks/useResults';
import { useGameMode } from '../../../contexts/GameModeContext';
import MatchResult from '../components/MatchResult';
import { ResultsProvider, useResultsContext } from '../contexts/ResultsContext';

function Results() {
    const { t } = useTranslation();
    const { isXL } = useBreakpoint();
    const toast: ToastType = useToast();
    const Wrapper = getWrapper();
    const { isRealMode, selectedPaidLeague, hasPayedForRound, addPaidRoundId } = useGameMode();
    const { data: freeLeague, isLoading: isFreeLeagueLoading } = useUserLeague();

    // Determine which league to use based on mode
    const league = isRealMode && selectedPaidLeague ? selectedPaidLeague.league : freeLeague;
    const isLeagueLoading = isRealMode ? false : isFreeLeagueLoading;

    const { data: rounds, isLoading: isRoundsLoading } = useRounds(league?.id, true);

    // Filter rounds based on start_round_number in REAL mode
    const filteredRounds = useMemo(() => {
        if (!rounds) return [];
        if (!isRealMode || !selectedPaidLeague) return rounds;

        const startRoundNumber = selectedPaidLeague.start_round_number || 1;
        return rounds.filter((round) =>
            round.number_round >= startRoundNumber
        );
    }, [rounds, isRealMode, selectedPaidLeague]);

    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState<boolean>(false);
    const [pendingRoundSwap, setPendingRoundSwap] = useState<{ id: number; slug: Slug } | null>(null);

    const { arePredictionsSaved, setArePredictionsSaved } = useResultsContext();

    useEffect(() => {
        if (filteredRounds && filteredRounds.length > 0 && activeRoundId === null) {
            const nextId = getNextRoundId(filteredRounds);
            setActiveRoundId(nextId);
        }
    }, [filteredRounds]);

    const { data: serverMatchResults, isLoading: isMatchesLoading } = useMatchResults(activeRoundId);
    const { mutate: savePredictionsMutate, isPending: isSaving } = useUpdateMatchResults();

    const [localMatchResults, setLocalMatchResults] = useState<MatchResultProps[]>([]);

    useEffect(() => {
        if (serverMatchResults) {
            setLocalMatchResults(serverMatchResults);
        }
    }, [serverMatchResults]);

    const savePredictions = () => {
        // In REAL mode, check if user has paid for this round
        if (isRealMode && activeRoundId && !hasPayedForRound(activeRoundId)) {
            setPaymentModalVisible(true);
            return;
        }

        savePredictionsMutate(localMatchResults, {
            onSuccess: () => {
                toast.show(t('matches-saved-successfully'), { type: 'success' });
                setArePredictionsSaved(true);
                if (pendingRoundSwap) {
                    setActiveRoundId(pendingRoundSwap.id);
                    setPendingRoundSwap(null);
                    setModalVisible(false);
                }
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            },
        });
    };

    const swapRoundMatchResults = (
        roundId: number, roundSlug: Slug, alreadyShowedModal?: boolean
    ) => {
        if (alreadyShowedModal || arePredictionsSaved) {
            setActiveRoundId(roundId);
        } else {
            setPendingRoundSwap({ id: roundId, slug: roundSlug });
            setModalVisible(true);
        }
    };

    useEffect(() => {
        const sendFCMToken = async () => {
            try {
                const existingFCMToken = await AsyncStorage.getItem('FCMToken');
                if (!existingFCMToken) {
                    const token = await getToken();
                    const fcmToken = await getFCMToken();
                    if (token && fcmToken) {
                        const response = registerPush(token, fcmToken);
                        if (response) {
                            await AsyncStorage.setItem('FCMToken', fcmToken);
                        }
                    }
                }
            } catch (error) {
                Sentry.captureException(error);
            }
        };
        sendFCMToken();
    }, []);

    useEffect(() => {
        try {
            showOpenAppAd(process.env.OPEN_AD_APP_ID);
        } catch (error) {
            Sentry.captureException(error);
        }
    }, []);

    const isLoading = isLeagueLoading || isRoundsLoading;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
            </View>
        );
    }

    return (
        <Wrapper style={styles.container}>
            {isLoading ? (
                <ShimmerPlaceholder style={styles.roundsListLoading} />
            ) : (
                <RoundsPicker
                    rounds={filteredRounds}
                    handleRoundSwap={swapRoundMatchResults}
                    activeRoundId={activeRoundId}
                    isResultsTab={true}
                    isRealMode={isRealMode}
                    roundPriceArs={selectedPaidLeague?.round_price_ars}
                />
            )}

            <SaveChanges
                visible={modalVisible}
                savePredictions={savePredictions}
                onClose={() => {
                    setModalVisible(false);
                    setPendingRoundSwap(null);
                }}
                isLoading={isSaving}
                nextRoundId={pendingRoundSwap?.id || 0}
                nextRoundSlug={pendingRoundSwap?.slug || ''}
                handleRoundSwap={(id, slug) => {
                    setActiveRoundId(id);
                    setPendingRoundSwap(null);
                    setModalVisible(false);
                }}
            />

            {isRealMode && activeRoundId && (
                <PaymentRequiredModal
                    visible={paymentModalVisible}
                    onClose={() => setPaymentModalVisible(false)}
                    roundId={activeRoundId}
                    roundName={filteredRounds?.find(r => r.id === activeRoundId)?.name}
                />
            )}

            {isRealMode && activeRoundId && !hasPayedForRound(activeRoundId) && (
                <View style={styles.warningCard}>
                    <Ionicons name="alert-circle" size={20} color={colors.warning} />
                    <Text style={styles.warningText}>{t('unpaid-round-warning')}</Text>
                </View>
            )}

            {isMatchesLoading ? (
                <View style={styles.matchesLoading}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[
                        styles.matchResultsContainer,
                        { width: isXL ? '60%' : '100%' },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {localMatchResults.map((matchResult) => (
                        <MatchResult
                            key={matchResult.id}
                            currentMatchResult={matchResult}
                            matchResults={localMatchResults}
                            setMatchResults={setLocalMatchResults}
                        />
                    ))}
                </ScrollView>
            )}

            {/* Floating Save Button */}
            <Pressable
                style={({ pressed }) => [
                    styles.saveButton,
                    isRealMode && styles.saveButtonReal,
                    pressed && styles.saveButtonPressed,
                ]}
                onPress={() => !isSaving && savePredictions()}
            >
                {isSaving ? (
                    <ActivityIndicator color={colors.background} size="small" />
                ) : (
                    <>
                        <Ionicons
                            name={isRealMode ? 'cash' : 'checkmark-circle'}
                            size={20}
                            color={colors.background}
                        />
                        <Text style={styles.saveButtonText}>
                            {isRealMode && activeRoundId && !hasPayedForRound(activeRoundId)
                                ? `${t('pay-to-play')}${selectedPaidLeague?.round_price_ars ? ` ($${selectedPaidLeague.round_price_ars} ARS)` : ''}`
                                : t('save-predictions')
                            }
                        </Text>
                    </>
                )}
            </Pressable>
        </Wrapper>
    );
}

export default function ResultsContextWrapper() {
    return (
        <ResultsProvider>
            <Results />
        </ResultsProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    roundsListLoading: {
        width: '100%',
        height: 50,
        marginBottom: spacing.lg,
    },
    matchesLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    matchResultsContainer: {
        paddingBottom: 100,
        paddingHorizontal: spacing.md,
        marginHorizontal: 'auto',
        flexGrow: 1,
    },
    saveButton: {
        position: 'absolute',
        bottom: spacing.lg,
        left: spacing.lg,
        right: spacing.lg,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    saveButtonReal: {
        backgroundColor: colors.coins,
    },
    saveButtonPressed: {
        opacity: 0.8,
    },
    warningCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        padding: spacing.md,
        backgroundColor: colors.warningBg,
        borderLeftWidth: 4,
        borderLeftColor: colors.warning,
        borderRadius: borderRadius.sm,
    },
    warningText: {
        color: colors.warningLight,
        fontSize: typography.fontSize.bodySmall,
        flex: 1,
    },
    saveButtonText: {
        color: colors.background,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
});
