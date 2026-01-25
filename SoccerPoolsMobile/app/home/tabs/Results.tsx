import { useEffect, useState } from 'react';
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
import MatchResult from '../components/MatchResult';
import { ResultsProvider, useResultsContext } from '../contexts/ResultsContext';

function Results() {
    const { t } = useTranslation();
    const { isXL } = useBreakpoint();
    const toast: ToastType = useToast();
    const Wrapper = getWrapper();

    const { data: league, isLoading: isLeagueLoading } = useUserLeague();
    const { data: rounds, isLoading: isRoundsLoading } = useRounds(league?.id, true);

    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [pendingRoundSwap, setPendingRoundSwap] = useState<{ id: number; slug: Slug } | null>(null);

    const { arePredictionsSaved, setArePredictionsSaved } = useResultsContext();

    useEffect(() => {
        if (rounds && rounds.length > 0 && activeRoundId === null) {
            const nextId = getNextRoundId(rounds);
            setActiveRoundId(nextId);
        }
    }, [rounds]);

    const { data: serverMatchResults, isLoading: isMatchesLoading } = useMatchResults(activeRoundId);
    const { mutate: savePredictionsMutate, isPending: isSaving } = useUpdateMatchResults();

    const [localMatchResults, setLocalMatchResults] = useState<MatchResultProps[]>([]);

    useEffect(() => {
        if (serverMatchResults) {
            setLocalMatchResults(serverMatchResults);
        }
    }, [serverMatchResults]);

    const savePredictions = () => {
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
                    rounds={rounds || []}
                    handleRoundSwap={swapRoundMatchResults}
                    activeRoundId={activeRoundId}
                    isResultsTab={true}
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
                style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
                onPress={() => !isSaving && savePredictions()}
            >
                {isSaving ? (
                    <ActivityIndicator color={colors.background} size="small" />
                ) : (
                    <>
                        <Ionicons name="checkmark-circle" size={20} color={colors.background} />
                        <Text style={styles.saveButtonText}>{t('save-predictions')}</Text>
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
    saveButtonPressed: {
        opacity: 0.8,
    },
    saveButtonText: {
        color: colors.background,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
});
