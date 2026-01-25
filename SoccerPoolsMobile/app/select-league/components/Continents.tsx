import { Text, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface Props {
    item: { id: number; name: string };
    selectedContinent: { id: number; name: string };
    setSelectedContinent: (continent: { id: number; name: string }) => void;
}

export default function Continents({ item, selectedContinent, setSelectedContinent }: Props) {
    const isSelected: boolean = selectedContinent.id === item.id;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.tab,
                isSelected && styles.tabSelected,
                pressed && !isSelected && styles.tabPressed,
            ]}
            onPress={() => setSelectedContinent(item)}
        >
            <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
                {item.name}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    tab: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundCard,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    tabSelected: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    tabPressed: {
        backgroundColor: colors.surfaceLight,
    },
    tabText: {
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.labelMedium,
    },
    tabTextSelected: {
        color: colors.background,
        fontWeight: typography.fontWeight.semibold,
    },
});