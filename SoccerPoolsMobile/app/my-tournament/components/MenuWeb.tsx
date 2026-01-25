import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TournamentProps } from 'types';
import { colors, spacing, typography, borderRadius } from '../../../theme';

interface MenuWebProps {
    tournament: TournamentProps;
    t: (key: string) => string;
    handleTournamentClick: (slug: string) => void;
    handleShare: () => void;
}

export default function MenuWeb({
    tournament, t, handleTournamentClick, handleShare
}: MenuWebProps) {

    return (
        <View style={styles.container}>
            <Pressable
                onPress={handleShare}
                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
                <Ionicons name="share-social-outline" size={18} color={colors.accent} />
                <Text style={styles.menuText}>{t('invite-friends')}</Text>
            </Pressable>

            {tournament && tournament.is_current_user_admin && (
                <View style={styles.adminItems}>
                    <Pressable
                        onPress={() => handleTournamentClick('pending-invites')}
                        style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    >
                        <Ionicons name="hourglass-outline" size={18} color={colors.textSecondary} />
                        <Text style={styles.menuText}>{t('pending-invites')}</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => handleTournamentClick('edit-tournament')}
                        style={({ pressed }) => [
                            styles.iconButton, pressed && styles.iconButtonPressed
                        ]}
                        accessibilityRole="button"
                    >
                        <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    adminItems: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.surfaceLight,
    },
    menuItemPressed: {
        backgroundColor: colors.backgroundCard,
    },
    menuText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.medium,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonPressed: {
        backgroundColor: colors.accent,
    },
});
