import { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../../../theme';

type Props = PropsWithChildren<{ style?: any }>;

export default function Frame({ style, children }: Props) {
    return (
        <View style={[styles.frame, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    frame: {
        borderRadius: borderRadius.lg,
        padding: 2,
        backgroundColor: colors.surfaceBorder,
    },
});
