import { StyleSheet, View, Pressable, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';

interface ThemedCardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    onPress?: () => void;
    style?: ViewStyle;
    noPadding?: boolean;
}

export default function ThemedCard({
    children, variant = 'default', onPress, style, noPadding = false,
}: ThemedCardProps) {
    const getCardStyle = () => {
        switch (variant) {
            case 'elevated':
                return styles.elevated;
            case 'outlined':
                return styles.outlined;
            default:
                return styles.default;
        }
    };

    const content = (
        <View style={[
            styles.card,
            getCardStyle(),
            noPadding && styles.noPadding,
            style,
        ]}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
                {content}
            </Pressable>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    default: {
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    outlined: {
        backgroundColor: colors.transparent,
        borderWidth: 1.5,
        borderColor: colors.surfaceBorder,
    },
    noPadding: {
        padding: 0,
    },
});
