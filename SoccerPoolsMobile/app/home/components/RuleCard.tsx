import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface Props {
    ruleId: number;
    ruleText: string;
    ruleIcon: string;
}

export default function RuleCard({ ruleId, ruleText, ruleIcon }: Props) {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();

    return (
        <View style={[styles.card, isLG && styles.cardLG]}>
            {/* Icon Badge */}
            <View style={styles.iconBadge}>
                <Ionicons name={ruleIcon as any} size={24} color={colors.accent} />
            </View>

            {/* Content */}
            <View style={styles.textWrap}>
                <View style={styles.ruleHeader}>
                    <View style={styles.numberBadge}>
                        <Text style={styles.numberText}>{ruleId}</Text>
                    </View>
                    <Text style={styles.ruleTitle}>
                        {t('how-to-play')} #{ruleId}
                    </Text>
                </View>
                <Text style={styles.ruleText}>{ruleText}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    cardLG: {
        padding: spacing.lg,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    textWrap: {
        flex: 1,
    },
    ruleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    numberBadge: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
        marginRight: spacing.sm,
    },
    numberText: {
        color: colors.background,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.labelSmall,
    },
    ruleTitle: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.medium,
    },
    ruleText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        lineHeight: 22,
    },
});
