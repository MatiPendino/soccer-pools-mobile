import { View, Image, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../../../theme';

type Props = {
    uri: string;
    height: number;
    onInfo: () => void;
};

export default function PrizeHero({ uri, height, onInfo }: Props) {
    return (
        <View style={[styles.hero, { height }]}>
            <View style={styles.surface}>
                <Image source={{ uri }} style={styles.img} resizeMode='contain' />
            </View>

            <Pressable
                onPress={onInfo}
                hitSlop={8}
                style={({ pressed }) => [styles.infoBtn, pressed && styles.pressed]}
            >
                <Ionicons name='information-circle-outline' size={18} color={colors.accent} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: {
        padding: spacing.md,
        backgroundColor: colors.backgroundElevated,
        position: 'relative',
    },
    surface: {
        flex: 1,
        borderRadius: borderRadius.md,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    img: {
        width: '90%',
        height: '90%',
    },
    infoBtn: {
        position: 'absolute',
        right: spacing.sm,
        top: spacing.sm,
        padding: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundCard,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
});
