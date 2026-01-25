import { Pressable, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface Props {
    setOpen: (open: boolean) => void;
    currentName: string;
}

export default function CurrentRoundButton({ setOpen, currentName }: Props) {
    return (
        <Pressable
            onPress={() => setOpen(true)}
            style={({ pressed }) => [styles.currentBtn, pressed && styles.currentBtnPressed]}
        >
            <Text numberOfLines={1} style={styles.currentTxt}>
                {currentName.toUpperCase()}
            </Text>
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
    currentBtnPressed: {
        backgroundColor: colors.surfaceLight,
    },
    currentTxt: {
        fontSize: typography.fontSize.labelLarge,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
    },
});