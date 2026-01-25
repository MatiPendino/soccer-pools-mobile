import { Pressable, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme';

interface Props {
    direction: 'left' | 'right';
    disabled?: boolean;
    onPress: () => void;
}

export default function ArrowButton({ direction, disabled, onPress }: Props) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.arrowBtn,
                disabled && styles.arrowDisabled,
                pressed && !disabled && styles.arrowPressed,
            ]}
            hitSlop={10}
        >
            <Entypo name={`chevron-${direction}`} color={colors.textPrimary} size={22} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    arrowBtn: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceLight,
    },
    arrowDisabled: {
        opacity: 0.35,
    },
    arrowPressed: {
        backgroundColor: colors.accent,
    },
});
