import { 
    createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode 
} from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { safeSetItem, safeRemoveItem } from '../utils/safeStorage';
import { PaidLeagueConfigProps } from '../types';
import { getPaidBetRounds } from '../services/paymentService';
import { getToken } from '../utils/storeToken';

export type GameMode = 'free' | 'real';

interface GameModeContextValue {
    gameMode: GameMode;
    setGameMode: (mode: GameMode) => void;
    isRealMoneyAvailable: boolean;
    isRealMode: boolean;
    isFreeMode: boolean;
    selectedPaidLeague: PaidLeagueConfigProps | null;
    setSelectedPaidLeague: (league: PaidLeagueConfigProps | null) => void;
    paidRoundIds: number[];
    addPaidRoundId: (roundId: number) => void;
    hasPayedForRound: (roundId: number) => boolean;
    syncPaidRoundsFromBackend: () => Promise<void>;
    clearPaidState: () => void;
}

const GAME_MODE_STORAGE_KEY = 'gameMode';
const SELECTED_PAID_LEAGUE_KEY = 'selectedPaidLeague';
const PAID_ROUND_IDS_KEY = 'paidRoundIds';

const GameModeContext = createContext<GameModeContextValue | null>(null);

interface GameModeProviderProps {
    children: ReactNode;
}

export const GameModeProvider = ({ children }: GameModeProviderProps) => {
    const [gameMode, setGameModeState] = useState<GameMode>('free');
    const [selectedPaidLeague, setSelectedPaidLeagueState] = useState<PaidLeagueConfigProps | null>(null);
    const [paidRoundIds, setPaidRoundIds] = useState<number[]>([]);

    const isRealMoneyAvailable = Platform.OS === 'web';

    // Load persisted state on mount (web only)
    useEffect(() => {
        if (isRealMoneyAvailable) {
            // Load game mode
            AsyncStorage.getItem(GAME_MODE_STORAGE_KEY).then((storedMode) => {
                if (storedMode === 'real' || storedMode === 'free') {
                    setGameModeState(storedMode);
                }
            }).catch(() => {});

            // Load selected paid league
            AsyncStorage.getItem(SELECTED_PAID_LEAGUE_KEY).then((storedLeague) => {
                if (storedLeague) {
                    try {
                        setSelectedPaidLeagueState(JSON.parse(storedLeague));
                    } catch (e) {
                        if (__DEV__) console.warn('Failed to parse stored paid league');
                    }
                }
            }).catch(() => {});

            // Load paid round IDs
            AsyncStorage.getItem(PAID_ROUND_IDS_KEY).then((storedIds) => {
                if (storedIds) {
                    try {
                        setPaidRoundIds(JSON.parse(storedIds));
                    } catch (e) {
                        if (__DEV__) console.warn('Failed to parse stored paid round IDs');
                    }
                }
            }).catch(() => {});
        }
    }, [isRealMoneyAvailable]);

    const setGameMode = useCallback((mode: GameMode) => {
        if (!isRealMoneyAvailable && mode === 'real') {
            return;
        }
        setGameModeState(mode);

        if (isRealMoneyAvailable) {
            safeSetItem(GAME_MODE_STORAGE_KEY, mode);
        }

        // Clear paid league when switching to free mode
        if (mode === 'free') {
            setSelectedPaidLeagueState(null);
            if (isRealMoneyAvailable) {
                safeRemoveItem(SELECTED_PAID_LEAGUE_KEY);
            }
        }
    }, [isRealMoneyAvailable]);

    const setSelectedPaidLeague = useCallback((league: PaidLeagueConfigProps | null) => {
        setSelectedPaidLeagueState(league);

        if (isRealMoneyAvailable) {
            if (league) {
                safeSetItem(SELECTED_PAID_LEAGUE_KEY, JSON.stringify(league));
            } else {
                safeRemoveItem(SELECTED_PAID_LEAGUE_KEY);
            }
        }
    }, [isRealMoneyAvailable]);

    const addPaidRoundId = useCallback((roundId: number) => {
        setPaidRoundIds((prev) => {
            if (prev.includes(roundId)) return prev;
            const newIds = [...prev, roundId];
            if (isRealMoneyAvailable) {
                safeSetItem(PAID_ROUND_IDS_KEY, JSON.stringify(newIds));
            }
            return newIds;
        });
    }, [isRealMoneyAvailable]);

    const hasPayedForRound = useCallback((roundId: number) => {
        return paidRoundIds.includes(roundId);
    }, [paidRoundIds]);

    // Sync paid rounds from backend. Call this after payment success
    const syncPaidRoundsFromBackend = useCallback(async () => {
        if (!isRealMoneyAvailable) return;
        
        try {
            const token = await getToken();
            if (!token) return;
            const paidBetRounds = await getPaidBetRounds(token);
            const roundIds = paidBetRounds.map((br) => br.round_id).filter(Boolean);
            setPaidRoundIds(roundIds);
            safeSetItem(PAID_ROUND_IDS_KEY, JSON.stringify(roundIds));
        } catch (error) {
            if (__DEV__) console.warn('Failed to sync paid rounds from backend:', error);
        }
    }, [isRealMoneyAvailable]);

    // Sync paid rounds on mount when in real mode
    useEffect(() => {
        if (isRealMoneyAvailable && gameMode === 'real') {
            syncPaidRoundsFromBackend();
        }
    }, [isRealMoneyAvailable, gameMode, syncPaidRoundsFromBackend]);

    const clearPaidState = useCallback(() => {
        setSelectedPaidLeagueState(null);
        setPaidRoundIds([]);
        if (isRealMoneyAvailable) {
            safeRemoveItem(SELECTED_PAID_LEAGUE_KEY);
            safeRemoveItem(PAID_ROUND_IDS_KEY);
        }
    }, [isRealMoneyAvailable]);

    const value = useMemo(
        () => ({
            gameMode,
            setGameMode,
            isRealMoneyAvailable,
            isRealMode: gameMode === 'real' && isRealMoneyAvailable,
            isFreeMode: gameMode === 'free' || !isRealMoneyAvailable,
            selectedPaidLeague,
            setSelectedPaidLeague,
            paidRoundIds,
            addPaidRoundId,
            hasPayedForRound,
            syncPaidRoundsFromBackend,
            clearPaidState,
        }),
        [
            gameMode,
            setGameMode,
            isRealMoneyAvailable,
            selectedPaidLeague,
            setSelectedPaidLeague,
            paidRoundIds,
            addPaidRoundId,
            hasPayedForRound,
            syncPaidRoundsFromBackend,
            clearPaidState,
        ]
    );

    return (
        <GameModeContext.Provider value={value}>
            {children}
        </GameModeContext.Provider>
    );
};

export const useGameMode = (): GameModeContextValue => {
    const context = useContext(GameModeContext);
    if (!context) {
        throw new Error('useGameMode must be used within a GameModeProvider');
    }
    return context;
};
