import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../../../theme';

type Props = {
    title: string;
    onPress: (prizeId: number) => void;
    style?: ViewStyle;
    textStyle?: any;
    prizeId: number;
    isClaiming: boolean;
};

export default function GradientButton({
    title, onPress, style, textStyle, prizeId, isClaiming = false
}: Props) {
    return (
        <Pressable
            onPress={() => onPress(prizeId)}
            style={({ pressed }) => [
                styles.button,
                style,
                pressed && styles.pressed,
                isClaiming && styles.disabled
            ]}
            disabled={isClaiming}
        >
            {isClaiming ? (
                <ActivityIndicator size='small' color={colors.background} />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        width: '90%',
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: colors.background,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.bodyMedium,
        letterSpacing: 0.3,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.6,
    },
});
