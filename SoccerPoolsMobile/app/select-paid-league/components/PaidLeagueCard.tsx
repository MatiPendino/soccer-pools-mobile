import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useGameMode } from '../../../contexts/GameModeContext';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import { PaidLeagueConfigProps } from '../../../types';

interface PaidLeagueCardProps {
    item: PaidLeagueConfigProps;
}

export default function PaidLeagueCard({ item }: PaidLeagueCardProps) {
    const { t } = useTranslation();
    const { width, isLG } = useBreakpoint();
    const router = useRouter();
    const { setSelectedPaidLeague } = useGameMode();

    const cardWidth: number = isLG ? width * 0.22 : width * 0.44;

    const selectLeague = () => {
        // Store the selected paid league in context
        setSelectedPaidLeague(item);

        router.replace('/home');
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.card,
                { width: cardWidth },
                pressed && styles.cardPressed,
            ]}
            onPress={selectLeague}
        >
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: item.league.logo }}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.name} numberOfLines={2}>
                {item.league.name}
            </Text>

            <Text style={styles.tapToJoin}>
                {t('tap-to-join')}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.coins,
        position: 'relative',
        minHeight: 180,
    },
    cardPressed: {
        backgroundColor: colors.surfaceLight,
        transform: [{ scale: 0.98 }],
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.md,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        padding: spacing.sm,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    tapToJoin: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.labelSmall,
        marginTop: 'auto',
    },
});
