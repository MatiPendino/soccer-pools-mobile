import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../../theme';

type NavbarVariant = 'landing' | 'login' | 'create-account';

interface NavbarProps {
    variant: NavbarVariant;
    referralCode?: string | string[];
}

export default function Navbar({ variant, referralCode = '' }: NavbarProps) {
    const { isLG } = useBreakpoint();
    const { t } = useTranslation();
    const code = Array.isArray(referralCode) ? referralCode[0] : referralCode;

    const showLoginLink = variant === 'landing' || variant === 'create-account';
    const showRegisterButton = variant === 'landing' || variant === 'login';

    return (
        <View style={[styles.navbar, isLG && styles.navbarLG]}>
            {variant === 'landing' && isLG && <View style={{ width: 40 }} />}

            <Link href="/">
                <View style={[
                    styles.navBrand, { paddingTop: variant === 'landing' && !isLG ? 20 : 0 }
                ]}>
                    <View style={styles.navLogoContainer}>
                        <Ionicons name="football" size={20} color={colors.accent} />
                    </View>
                    <Text style={styles.navBrandText}>ProdeApp</Text>
                </View>
            </Link>

            {(variant !== 'landing' || isLG) && (
                <View style={styles.navActions}>
                    {showLoginLink && variant !== 'landing' && (
                        <Link href={`/login?referralCode=${code}`}>
                            <Text style={styles.navLoginText}>{t('log-in')}</Text>
                        </Link>
                    )}
                    {showRegisterButton && (
                        <Link href={`/create-account?referralCode=${code}`}>
                            <View style={styles.navRegisterBtn}>
                                <Text style={styles.navRegisterText}>{t('create-account')}</Text>
                            </View>
                        </Link>
                    )}
                    {variant === 'landing' && isLG && (
                        <Link href={`/login?referralCode=${code}`}>
                            <Text style={styles.navLoginText}>{t('log-in')}</Text>
                        </Link>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: 'rgba(10, 10, 15, 0.8)',
    },
    navbarLG: {
        paddingHorizontal: spacing.xxl,
    },
    navBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    navLogoContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(0, 212, 170, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 170, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBrandText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.bold,
    },
    navActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    navLoginText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodySmall,
        fontWeight: typography.fontWeight.semibold,
    },
    navRegisterBtn: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    navRegisterText: {
        color: colors.background,
        fontSize: typography.fontSize.bodySmall,
        fontWeight: typography.fontWeight.semibold,
    },
});
