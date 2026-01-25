import { StyleSheet, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ThemedButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    label: string;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export default function ThemedButton({
    variant = 'primary', size = 'md', label, onPress, disabled = false, loading = false,
    fullWidth = false, icon,
}: ThemedButtonProps) {
    const isDisabled: boolean = disabled || loading;

    const getBackgroundColor = () => {
        if (isDisabled) return colors.surfaceLight;
        switch (variant) {
            case 'primary': return colors.accent;
            case 'secondary': return colors.backgroundCard;
            case 'outline': return colors.transparent;
            case 'ghost': return colors.transparent;
            case 'danger': return colors.error;
            default: return colors.accent;
        }
    };

    const getTextColor = () => {
        if (isDisabled) return colors.textDisabled;
        switch (variant) {
            case 'primary': return colors.background;
            case 'secondary': return colors.textPrimary;
            case 'outline': return colors.accent;
            case 'ghost': return colors.textSecondary;
            case 'danger': return colors.white;
            default: return colors.background;
        }
    };

    const getBorderColor = () => {
        if (variant === 'outline') return colors.accent;
        if (variant === 'secondary') return colors.surfaceBorder;
        return colors.transparent;
    };

    const sizeStyles = {
        sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: typography.fontSize.labelMedium },
        md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: typography.fontSize.bodyMedium },
        lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl, fontSize: typography.fontSize.bodyLarge },
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    paddingVertical: sizeStyles[size].paddingVertical,
                    paddingHorizontal: sizeStyles[size].paddingHorizontal,
                    opacity: pressed ? 0.8 : 1,
                },
                fullWidth && styles.fullWidth,
                variant === 'outline' && styles.outlined,
            ]}
        >
            <View style={styles.content}>
                {loading ? (
                    <ActivityIndicator size="small" color={getTextColor()} />
                ) : (
                    <>
                        {icon && <View style={styles.icon}>{icon}</View>}
                        <Text style={[
                            styles.label,
                            { color: getTextColor(), fontSize: sizeStyles[size].fontSize }
                        ]}>
                            {label}
                        </Text>
                    </>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.transparent,
    },
    outlined: {
        borderWidth: 1.5,
    },
    fullWidth: {
        width: '100%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: spacing.sm,
    },
    label: {
        fontWeight: typography.fontWeight.semibold,
        textAlign: 'center',
    },
});
