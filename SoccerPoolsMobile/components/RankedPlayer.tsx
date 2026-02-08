import { View, StyleSheet, Image, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { CoinsPrizes } from '../types';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../theme';

interface RankedPlayerProps {
    index: number;
    profileImageUrl: string;
    username: string;
    points: number;
    coinPrizes?: CoinsPrizes | null;
    exactResults: number;
    isPaidMode?: boolean;
    prizePoolTotal?: string | null;
}

export default function RankedPlayer({
    index, profileImageUrl, username, points, coinPrizes, exactResults, 
    isPaidMode=false, prizePoolTotal=null
}: RankedPlayerProps) {
    const { isLG } = useBreakpoint();
    const { t } = useTranslation();

    // Calculate actual prize amount from pool total
    const getPrizeAmount = (position: number, poolTotal: number): number => {
        if (position === 1) return Math.floor(poolTotal * 0.60);
        if (position === 2) return Math.floor(poolTotal * 0.25);
        if (position === 3) return Math.floor(poolTotal * 0.15);
        return 0;
    };

    const prizeAmount = isPaidMode && prizePoolTotal && index <= 3
        ? getPrizeAmount(index, parseFloat(prizePoolTotal))
        : null;

    // Special styling for top 3 ranks
    const rankStyles = (() => {
        if (index === 1) {
            return {
                container: styles.goldContainer,
                indexStyle: styles.goldIndex,
                medal: require('../assets/img/trophy-cup.png'),
                showMedal: true,
                prize: coinPrizes?.coins_prize_first,
                prizeColor: colors.gold,
                borderColor: colors.gold,
            };
        } else if (index === 2) {
            return {
                container: styles.silverContainer,
                indexStyle: styles.silverIndex,
                medal: require('../assets/img/silver-medal.png'),
                showMedal: true,
                prize: coinPrizes?.coins_prize_second,
                prizeColor: colors.silver,
                borderColor: colors.silver,
            };
        } else if (index === 3) {
            return {
                container: styles.bronzeContainer,
                indexStyle: styles.bronzeIndex,
                medal: require('../assets/img/bronze-medal.png'),
                showMedal: true,
                prize: coinPrizes?.coins_prize_third,
                prizeColor: colors.bronze,
                borderColor: colors.bronze,
            };
        } else {
            return {
                container: styles.defaultContainer,
                indexStyle: styles.defaultIndex,
                showMedal: false,
                prize: null,
                prizeColor: colors.textMuted,
                borderColor: colors.surfaceBorder,
            };
        }
    })();

    return (
        <View style={[styles.container, rankStyles.container, { width: isLG ? '50%' : '95%' }]}>
            {/* Rank */}
            <View style={styles.rankContainer}>
                {rankStyles.showMedal ? (
                    <Image source={rankStyles.medal} style={styles.medalIcon} />
                ) : (
                    <Text style={[styles.indexTxt, rankStyles.indexStyle]}>{index}</Text>
                )}
            </View>

            {/* Profile Image */}
            <View style={styles.profileContainer}>
                <Image
                    style={[styles.profileImage, { borderColor: rankStyles.borderColor }]}
                    source={{ uri: profileImageUrl }}
                />
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.usernameTxt} numberOfLines={1} ellipsizeMode='tail'>
                    {username}
                </Text>

                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{t('points')}</Text>
                        <Text style={styles.statValue}>{points}</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>{t('exact-results')}</Text>
                        <Text style={styles.statValue}>{exactResults}</Text>
                    </View>
                </View>

                {/* Show prize for top 3 positions */}
                {rankStyles.showMedal && (
                    <View style={[styles.prizeContainer, { borderColor: rankStyles.prizeColor }]}>
                        <FontAwesome5 name={isPaidMode ? 'dollar-sign' : 'coins'} size={16} color='#f59e0b' />
                        {isPaidMode && prizeAmount !== null ? (
                            <Text style={styles.prizeTxt}>
                                {prizeAmount} ARS
                            </Text>
                        ) : rankStyles.prize ? (
                            <Text style={styles.prizeTxt}>{rankStyles.prize}</Text>
                        ) : null}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginHorizontal: 'auto',
        borderRadius: borderRadius.lg,
        marginVertical: spacing.sm,
        borderWidth: 1,
    },
    defaultContainer: {
        backgroundColor: colors.backgroundCard,
        borderColor: colors.surfaceBorder,
    },
    goldContainer: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderColor: colors.gold,
    },
    silverContainer: {
        backgroundColor: 'rgba(192, 192, 192, 0.1)',
        borderColor: colors.silver,
    },
    bronzeContainer: {
        backgroundColor: 'rgba(205, 127, 50, 0.1)',
        borderColor: colors.bronze,
    },
    rankContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    indexTxt: {
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.titleLarge,
        textAlign: 'center',
    },
    defaultIndex: {
        color: colors.textMuted,
    },
    goldIndex: {
        color: colors.gold,
    },
    silverIndex: {
        color: colors.silver,
    },
    bronzeIndex: {
        color: colors.bronze,
    },
    medalIcon: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    profileContainer: {
        marginRight: spacing.md,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.surfaceLight,
        borderWidth: 2,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    usernameTxt: {
        fontSize: typography.fontSize.titleSmall,
        color: colors.textPrimary,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.xs,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    statDivider: {
        width: 1,
        height: 14,
        backgroundColor: colors.surfaceBorder,
        marginHorizontal: spacing.sm,
    },
    statLabel: {
        fontSize: typography.fontSize.labelSmall,
        color: 'white',
    },
    statValue: {
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.labelLarge,
        color: colors.accent,
    },
    prizeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.coinsBg,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
        gap: spacing.xs,
        borderWidth: 1,
    },
    prizeTxt: {
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
        color: colors.coins,
    },
});