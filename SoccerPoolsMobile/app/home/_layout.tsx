import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import { removeToken } from 'services/api';
import { toCapitalCase } from 'utils/helper';
import { FACEBOOK_URL, INSTAGRAM_URL, TWITTER_URL } from '../../constants';
import CoinsDisplay from '../../components/CoinsDisplay';
import RateAppModal from '../../components/RateAppModal';
import handleShare from '../../utils/handleShare';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useFullUser } from '../../hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface NavItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    isActive?: boolean;
}

function NavItem({ icon, label, onPress, isActive }: NavItemProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.navItem,
                pressed && styles.navItemHovered,
                isActive && styles.navItemActive,
            ]}
        >
            <Ionicons name={icon} size={20} color={isActive ? colors.accent : colors.textSecondary} />
            <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>{label}</Text>
        </Pressable>
    );
}

export default function HomeLayout() {
    const { isSM, isLG } = useBreakpoint();
    const { t } = useTranslation();
    const toast = useToast();
    const router = useRouter();

    const { data: user, isLoading } = useFullUser();

    const logOut = async () => {
        try {
            await removeToken();
            await AsyncStorage.removeItem('FCMToken');
            toast.show(t('session-finished'), { type: 'success' });
            router.replace('/');
        } catch {
            toast.show('There was an error logging out', { type: 'danger' });
        }
    };

    return (
        <Drawer
            screenOptions={{
                drawerType: isLG ? 'permanent' : 'slide',
                swipeEnabled: !isLG,
                overlayColor: colors.overlay,
                drawerStyle: {
                    backgroundColor: colors.backgroundElevated,
                    width: isLG ? 280 : 300,
                    borderRightWidth: 1,
                    borderRightColor: colors.surfaceBorder,
                },
                headerStyle: {
                    backgroundColor: colors.backgroundElevated,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.surfaceBorder,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: colors.textPrimary,
                headerTitleStyle: {
                    fontWeight: typography.fontWeight.semibold,
                },
                headerLeft: isLG ? () => null : undefined,
                headerRight: () => (
                    <View style={styles.headerRight}>
                        <CoinsDisplay coins={isLoading ? '...' : (user?.coins || 0)} />
                        <RateAppModal />
                    </View>
                ),
                headerRightContainerStyle: { paddingRight: spacing.md },
            }}
            drawerContent={(props) => (
                <DrawerContentScrollView
                    {...props}
                    contentContainerStyle={styles.drawerContent}
                    style={styles.drawerScroll}
                >
                    {/* User Profile Section */}
                    <View style={styles.profileSection}>
                        <Text style={styles.userName}>
                            {isLoading ? '...' : `${user?.name ?? ''} ${user?.last_name ?? ''}`}
                        </Text>
                        <Text style={styles.userEmail}>{isLoading ? '...' : user?.email}</Text>
                        <Link href="/edit-account" style={styles.editProfileLink}>
                            {t('update-account')}
                        </Link>
                    </View>

                    {/* Navigation Items */}
                    <View style={styles.navSection}>
                        <NavItem 
                            icon="home-outline" 
                            label={t('home')} 
                            onPress={() => router.push('/home')} 
                        />
                        <NavItem 
                            icon="game-controller-outline" 
                            label={t('leagues')} 
                            onPress={() => router.push('/select-league')} 
                        />
                        {Platform.OS === 'web' && (
                            <NavItem 
                                icon="gift-outline" 
                                label={toCapitalCase(t('prizes'))} 
                                onPress={() => router.push('/prizes?backto=home')} 
                            />
                        )}
                        <NavItem 
                            icon="person-add-outline" 
                            label={t('referrals')} 
                            onPress={() => router.push(`/home/referrals?referralCode=${user?.referral_code}`)} 
                        />
                        <NavItem 
                            icon="help-circle-outline" 
                            label={t('how-to-play')} 
                            onPress={() => router.push('/home/how-to-play')} 
                        />
                        {Platform.OS === 'android' && (
                            <NavItem 
                                icon="share-social-outline" 
                                label={t('share')} 
                                onPress={() => handleShare()} 
                            />
                        )}
                    </View>

                    {/* Social Links */}
                    <View style={styles.socialSection}>
                        <Link href={INSTAGRAM_URL} style={styles.socialLink}>
                            <Ionicons name="logo-instagram" size={22} color={colors.textMuted} />
                        </Link>
                        <Link href={TWITTER_URL} style={styles.socialLink}>
                            <Ionicons name="logo-twitter" size={22} color={colors.textMuted} />
                        </Link>
                        <Link href={FACEBOOK_URL} style={styles.socialLink}>
                            <Ionicons name="logo-facebook" size={22} color={colors.textMuted} />
                        </Link>
                    </View>

                    {/* Logout Button */}
                    <Pressable onPress={logOut} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={20} color={colors.error} />
                        <Text style={styles.logoutText}>{t('log-out')}</Text>
                    </Pressable>
                </DrawerContentScrollView>
            )}
        >
            <Drawer.Screen name="index" options={{ title: t('home') }} />
            <Drawer.Screen name="how-to-play" options={{ title: t('how-to-play') }} />
            <Drawer.Screen name="referrals" options={{ title: t('referrals') }} />
        </Drawer>
    );
}

const styles = StyleSheet.create({
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    drawerScroll: {
        backgroundColor: colors.backgroundElevated,
    },
    drawerContent: {
        flex: 1,
        paddingTop: spacing.lg,
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    avatarText: {
        color: colors.background,
        fontSize: typography.fontSize.headlineLarge,
        fontWeight: typography.fontWeight.bold,
    },
    userName: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.xs,
    },
    userEmail: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
        marginBottom: spacing.md,
    },
    editProfileLink: {
        color: colors.accent,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.medium,
    },
    navSection: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.sm,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.xs,
    },
    navItemHovered: {
        backgroundColor: colors.surfaceLight,
    },
    navItemActive: {
        backgroundColor: colors.accentMuted,
    },
    navItemText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.medium,
        marginLeft: spacing.md,
    },
    navItemTextActive: {
        color: colors.accent,
    },
    socialSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xl,
        paddingVertical: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceBorder,
        marginTop: 'auto',
    },
    socialLink: {
        padding: spacing.sm,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.error,
        backgroundColor: colors.errorBg,
    },
    logoutText: {
        color: colors.error,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.medium,
        marginLeft: spacing.sm,
    },
});
