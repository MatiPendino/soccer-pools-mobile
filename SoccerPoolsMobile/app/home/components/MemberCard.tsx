import { View, Image, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

interface Props {
    username: string;
    profile_image: string;
    created_at: string;
}

export default function MemberCard({ username, profile_image, created_at }: Props) {
    return (
        <View style={styles.memberItem}>
            <Image
                source={{ uri: profile_image }}
                style={styles.avatar}
            />
            <View style={styles.memberInfo}>
                <Text style={styles.memberUsername}>{username}</Text>
                <Text style={styles.memberDate}>
                    {new Date(created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: spacing.md,
        backgroundColor: colors.surfaceLight,
        borderWidth: 2,
        borderColor: colors.accent,
    },
    memberInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    memberUsername: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    memberDate: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelMedium,
        marginTop: 2,
    },
});
