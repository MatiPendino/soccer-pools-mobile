import {
    StyleSheet, View, Text, TextInput, Pressable, ScrollView, ActivityIndicator
} from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import Clipboard from '@react-native-clipboard/clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { WEBSITE_URL } from '../../constants';
import { useReferrals } from '../../hooks/useReferrals';
import { PageHeader } from '../../components/ui';
import { colors, spacing, typography, borderRadius } from '../../theme';
import MemberCard from './components/MemberCard';

export default function Referrals() {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
    const { referralCode } = useLocalSearchParams();
    const toast: ToastType = useToast();

    const { data: members, isLoading } = useReferrals();

    const copyToClipboard = () => {
        Clipboard.setString(`${WEBSITE_URL}?referralCode=${referralCode}`);
        toast.show(t('referral-link-success'));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <PageHeader
                    badgeIcon="gift-outline"
                    badgeText={t('referrals')}
                    title={`${t('start-winning-today')}!`}
                />
            </View>

            {/* Invite Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="share-social-outline" size={20} color={colors.accent} />
                    <Text style={styles.sectionTitle}>{t('invite-new-members')}</Text>
                </View>

                <Text style={styles.methodsTxt}>{t('your-invitation-methods')}</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={`${WEBSITE_URL}?referralCode=${referralCode}`}
                        editable={false}
                        style={[styles.input, { fontSize: isLG ? 14 : 12 }]}
                        selectTextOnFocus
                    />
                    <Pressable
                        onPress={copyToClipboard}
                        style={({ pressed }) => [
                            styles.copyButton,
                            pressed && styles.copyButtonPressed
                        ]}
                    >
                        <Ionicons name="copy-outline" size={20} color={colors.accent} />
                    </Pressable>
                </View>
            </View>

            {/* Members Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="people-outline" size={20} color={colors.accent} />
                    <Text style={styles.sectionTitle}>{t('members')}</Text>
                    {members && members.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{members.length}</Text>
                        </View>
                    )}
                </View>

                {isLoading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color={colors.accent} />
                    </View>
                ) : members?.length > 0 ? (
                    members.map(member => (
                        <MemberCard
                            key={member.username}
                            username={member.username}
                            profile_image={member.profile_image}
                            created_at={member.created_at}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="people-outline" size={40} color={colors.textMuted} />
                        </View>
                        <Text style={styles.emptyText}>{t('no-members-yet')}</Text>
                        <Text style={styles.emptySubtext}>{t('share-referral-link')}</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    section: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        marginTop: spacing.lg,
        marginHorizontal: spacing.md,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        flex: 1,
    },
    countBadge: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    countText: {
        color: colors.background,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
    },
    methodsTxt: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.medium,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundInput,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        color: colors.textSecondary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        fontWeight: typography.fontWeight.medium,
    },
    copyButton: {
        padding: spacing.md,
        backgroundColor: colors.accentMuted,
    },
    copyButtonPressed: {
        backgroundColor: colors.accent,
    },
    loaderContainer: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    emptyText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    emptySubtext: {
        color: colors.textMuted,
        fontSize: typography.fontSize.bodyMedium,
        textAlign: 'center',
        marginTop: spacing.xs,
        paddingHorizontal: spacing.lg,
    },
});