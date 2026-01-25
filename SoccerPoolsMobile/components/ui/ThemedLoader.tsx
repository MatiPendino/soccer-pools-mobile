import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface ThemedLoaderProps {
    size?: 'small' | 'large';
    color?: string;
    message?: string;
    fullScreen?: boolean;
}

export default function ThemedLoader({
    size = 'large', color = colors.accent, message, fullScreen = false,
}: ThemedLoaderProps) {
    const content = (
        <View style={styles.content}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );

    if (fullScreen) {
        return <View style={styles.fullScreen}>{content}</View>;
    }

    return <View style={styles.container}>{content}</View>;
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    message: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
        marginTop: spacing.md,
    },
});
