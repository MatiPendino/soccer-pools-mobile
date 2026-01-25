import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text, Platform, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography, borderRadius } from '../theme';

interface Props {
    text: string;
    url: string;
}

export default function TopBar({ text, url }: Props) {
    return (
        <View style={styles.topBar}>
            <Link href={url} asChild>
                <Pressable style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.backButtonPressed
                ]}>
                    <Ionicons name="chevron-back" color={colors.textPrimary} size={24} />
                </Pressable>
            </Link>
            <Text style={styles.topBarTxt} numberOfLines={1}>{text}</Text>
            <View style={{ width: 40 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: colors.backgroundElevated,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonPressed: {
        backgroundColor: colors.accent,
    },
    topBarTxt: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: spacing.md,
    },
});