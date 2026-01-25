import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../../../theme';

type Props = {
    text: string;
    style?: ViewStyle;
};

export default function CoinPill({ text, style }: Props) {
    return (
        <View style={[styles.wrap, style]}>
            <View style={styles.inner}>
                <MaterialIcons name='monetization-on' size={16} color={colors.coins} />
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        borderRadius: borderRadius.full,
        padding: 2,
        alignSelf: 'flex-start',
        backgroundColor: colors.accent,
    },
    inner: {
        borderRadius: borderRadius.full,
        backgroundColor: colors.background,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        height: 30,
        paddingHorizontal: spacing.md,
    },
    text: {
        color: colors.coins,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.bold,
    },
});
