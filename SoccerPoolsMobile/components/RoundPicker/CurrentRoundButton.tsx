import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface Props {
    setOpen: (open: boolean) => void;
    currentName: string;
    isRealMode?: boolean;
    roundPriceArs?: string | null;
}

export default function CurrentRoundButton({
    setOpen, currentName, isRealMode=false,
}: Props) {
    return (
        <Pressable
            onPress={() => setOpen(true)}
            style={({ pressed }) => [
                styles.currentBtn,
                isRealMode && styles.currentBtnReal,
                pressed && styles.currentBtnPressed
            ]}
        >
            <View style={styles.textContainer}>
                <Text numberOfLines={1} style={styles.currentTxt}>
                    {currentName.toUpperCase()}
                </Text>
            </View>
            <Entypo name="chevron-down" color={colors.textPrimary} size={17} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    currentBtn: {
        flexShrink: 1,
        flex: 1,
        paddingHorizontal: spacing.md,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundCard,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    currentBtnReal: {
        borderColor: colors.coins,
    },
    currentBtnPressed: {
        backgroundColor: colors.surfaceLight,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        flexShrink: 1,
    },
    currentTxt: {
        fontSize: typography.fontSize.labelLarge,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
    },
    priceTxt: {
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.semibold,
        color: colors.coins,
    },
});