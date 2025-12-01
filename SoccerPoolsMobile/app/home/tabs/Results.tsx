import { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useTranslation } from 'react-i18next';
import { showOpenAppAd } from 'components/ads/Ads';
import SaveChanges from '../../../modals/SaveChanges';
import { MAIN_COLOR } from '../../../constants';
import { getToken } from '../../../utils/storeToken';
import MatchResult from '../components/MatchResult';
import { ResultsProvider, useResultsContext } from '../contexts/ResultsContext';
import { MatchResultProps, Slug } from '../../../types';
import { getNextRoundId } from '../../../utils/getNextRound';
import handleError from '../../../utils/handleError';
import { registerPush, getFCMToken } from '../../../services/pushNotificationService';
import { getWrapper } from '../../../utils/getWrapper';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import RoundsPicker from 'components/RoundPicker';
import { useUserLeague, useRounds } from '../../../hooks/useLeagues';
import { useMatchResults, useUpdateMatchResults } from '../../../hooks/useResults';

function Results({}) {
    const { t } = useTranslation();
    const { isXL } = useBreakpoint();
    const toast: ToastType = useToast();
    const Wrapper = getWrapper();

    const { data: league, isLoading: isLeagueLoading } = useUserLeague();
    const { data: rounds, isLoading: isRoundsLoading } = useRounds(league?.id, true);

    const [activeRoundId, setActiveRoundId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [pendingRoundSwap, setPendingRoundSwap] = useState<{ id: number, slug: Slug } | null>(null);

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
            }
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
        return <ActivityIndicator size='large' color='#0000ff' />
    };

    return (
        <Wrapper style={styles.container}>
            {
                isLoading
                    ?
                    <ShimmerPlaceholder style={styles.roundsListLoading} />
                    :
                    <RoundsPicker
                        rounds={rounds || []}
                        handleRoundSwap={swapRoundMatchResults}
                        activeRoundId={activeRoundId}
                        isResultsTab={true}
                    />
            }

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

            {
                isMatchesLoading
                ?
                    <ActivityIndicator style={{paddingBottom: 250}} size='large' color='#fff' />
                :
                    <ScrollView 
                        contentContainerStyle={[
                            styles.matchResultsContainer, {
                                marginTop: isXL ? 20 : 0,
                                width: isXL ? '50%' : '100%'
                            }
                        ]} 
                        showsVerticalScrollIndicator={true}
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
            }

            <Pressable
                style={styles.saveBtn}
                onPress={() => !isSaving ? savePredictions() : {}}
            >
                {
                    isSaving
                    ?
                    <ActivityIndicator color='#fff' size='small' />
                    :
                    <Text style={styles.saveTxt}>{t('save-predictions')}</Text>
                }
            </Pressable>
        </Wrapper>
    )
}

export default function ResultsContextWrapper({}) {
    return (
        <ResultsProvider>
            <Results />
        </ResultsProvider>
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
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 7,
        backgroundColor: '#d9d9d9',
        height: 50,
        marginBottom: 15
    },
    roundBtn: {
        marginHorizontal: 15,
        marginVertical: 0
    },
    roundTxt: {
        fontWeight: '700',
        fontSize: 17
    },
    activeRoundBtn: {
        borderBottomColor: MAIN_COLOR,
        borderBottomWidth: 5,
    },
    activeRoundTxt: {
        color: MAIN_COLOR
    },
    matchResultsContainer: {
        paddingBottom: 70,
        marginHorizontal: 'auto',
        flexGrow: 1
    },
    saveBtn: {
        width: '100%',
        backgroundColor: '#2F2766',
        paddingVertical: 20,
        position: 'absolute',
        left: 0,
        bottom: 0
    },
    saveTxt: {
        textAlign: 'center',
        fontWeight: '600',
        color: 'white',
        fontSize: 18
    }
})