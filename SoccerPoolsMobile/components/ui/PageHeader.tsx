import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface PageHeaderProps {
    badgeIcon: keyof typeof Ionicons.glyphMap;
    badgeText: string;
    title: string;
    subtitle?: string;
}

export default function PageHeader({ badgeIcon, badgeText, title, subtitle }: PageHeaderProps) {
    const { isLG } = useBreakpoint();

    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <Ionicons name={badgeIcon} size={14} color={colors.accent} />
                <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
            <Text style={[styles.title, isLG && styles.titleLG]}>
                {title}
            </Text>
            {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.accentMuted,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        marginBottom: spacing.sm,
    },
    badgeText: {
        color: colors.accent,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: 1,
    },
    title: {
        fontSize: typography.fontSize.headlineMedium,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
    },
    titleLG: {
        fontSize: typography.fontSize.headlineLarge,
    },
    subtitle: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});
