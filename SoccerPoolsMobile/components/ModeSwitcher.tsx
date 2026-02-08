import { Platform, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useGameMode, GameMode } from '../contexts/GameModeContext';
import { usePaidLeagues } from '../hooks/usePayment';
import { useUserLeague } from '../hooks/useLeagues';
import { colors, spacing, typography, borderRadius } from '../theme';

export default function ModeSwitcher() {
    const { t } = useTranslation();
    const router = useRouter();
    const { 
        gameMode, setGameMode, isRealMoneyAvailable, setSelectedPaidLeague 
    } = useGameMode();
    const { data: freeLeague } = useUserLeague();
    const { data: paidLeagues } = usePaidLeagues();

    // Don't render on mobile platforms
    if (!isRealMoneyAvailable) {
        return null;
    }

    const handleModeChange = (mode: GameMode) => {
        setGameMode(mode);

        if (mode === 'real') {
            // Check if current free league has a paid version
            const currentLeagueSlug = freeLeague?.slug;
            const matchingPaidLeague = paidLeagues?.find(
                (paidLeague) => paidLeague.league.slug === currentLeagueSlug
            );

            if (matchingPaidLeague) {
                // Stay on current page, just switch to paid version of same league
                setSelectedPaidLeague(matchingPaidLeague);
            } else {
                router.push('/select-paid-league');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{t('game-mode')}</Text>
            <View style={styles.switchContainer}>
                {/* FREE Mode Button */}
                <Pressable
                    onPress={() => handleModeChange('free')}
                    style={[
                        styles.modeButton,
                        styles.modeButtonLeft,
                        gameMode === 'free' && styles.modeButtonActive,
                    ]}
                >
                    <Ionicons
                        name="game-controller"
                        size={16}
                        color={gameMode === 'free' ? colors.background : colors.textSecondary}
                    />
                    <Text
                        style={[
                            styles.modeButtonText,
                            gameMode === 'free' && styles.modeButtonTextActive,
                        ]}
                    >
                        {t('free-mode')}
                    </Text>
                </Pressable>

                {/* REAL Mode Button */}
                <Pressable
                    onPress={() => handleModeChange('real')}
                    style={[
                        styles.modeButton,
                        styles.modeButtonRight,
                        gameMode === 'real' && styles.modeButtonActiveReal,
                    ]}
                >
                    <Ionicons
                        name="cash"
                        size={16}
                        color={gameMode === 'real' ? colors.background : colors.textSecondary}
                    />
                    <Text
                        style={[
                            styles.modeButtonText,
                            gameMode === 'real' && styles.modeButtonTextActiveReal,
                        ]}
                    >
                        {t('real-mode')}
                    </Text>
                </Pressable>
            </View>
            {gameMode === 'real' && (
                <Text style={styles.realModeWarning}>
                    {t('real-mode-warning')}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    switchContainer: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        padding: 3,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        gap: spacing.xs,
    },
    modeButtonLeft: {
        borderTopLeftRadius: borderRadius.sm,
        borderBottomLeftRadius: borderRadius.sm,
    },
    modeButtonRight: {
        borderTopRightRadius: borderRadius.sm,
        borderBottomRightRadius: borderRadius.sm,
    },
    modeButtonActive: {
        backgroundColor: colors.accent,
        borderRadius: borderRadius.sm,
    },
    modeButtonActiveReal: {
        backgroundColor: colors.coins,
        borderRadius: borderRadius.sm,
    },
    modeButtonText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    modeButtonTextActive: {
        color: colors.background,
    },
    modeButtonTextActiveReal: {
        color: colors.background,
    },
    realModeWarning: {
        color: colors.coins,
        fontSize: typography.fontSize.labelSmall,
        marginTop: spacing.sm,
        textAlign: 'center',
    },
});
