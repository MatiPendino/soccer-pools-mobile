import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { toCapitalCase } from 'utils/helper';
import { ANDROID_URL, INSTAGRAM_URL, PORTFOLIO_URL, TWITTER_URL } from '../../constants';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function Footer() {
    const { isSM, isLG } = useBreakpoint();
    const { t } = useTranslation();
    const year: number = new Date().getFullYear();

    const QUICK_LINKS = [
        { label: toCapitalCase(t('log-in')), href: '/login' },
        { label: toCapitalCase(t('create-account')), href: '/create-account' },
        { label: t('download-app'), href: ANDROID_URL },
        { label: toCapitalCase(t('see-prizes')), href: '/prizes' },
    ];

    const SOCIALS = [
        { label: 'X', href: TWITTER_URL },
        { label: 'Instagram', href: INSTAGRAM_URL },
    ];

    return (
        <View style={styles.container}>
            <View style={[styles.row, isLG ? styles.rowWeb : styles.rowMobile]}>
                <View style={styles.brandCol}>
                    <Image source={require('../../assets/img/icon-no-bg2.png')} style={styles.logo} />
                    <Text style={styles.brandName}>ProdeApp</Text>
                    <Text style={[styles.tagline, { marginBottom: isSM ? 40 : 0 }]}>
                        {t('compete-predict-climb')}
                    </Text>
                </View>

                <View style={styles.linksCol}>
                    <Text style={styles.colTitle}>{t('quick-links')}</Text>
                    {QUICK_LINKS.map(({ label, href }) => (
                        <Link key={label} href={href}>
                            <Text style={styles.link}>{label}</Text>
                        </Link>
                    ))}
                </View>

                <View style={styles.socialCol}>
                    <Text style={styles.colTitle}>{t('follow-us')}</Text>
                    <View style={styles.socialRow}>
                        {SOCIALS.map(({ label, href }) => (
                            <Link key={label} href={href} style={styles.socialBadge} target="_blank">
                                <Text style={styles.socialText}>{label}</Text>
                            </Link>
                        ))}
                    </View>
                </View>
            </View>

            <Text style={styles.copy}>
                © {year} ProdeApp. {t('all-rights-reserved')} {t('developed-by')}
                <Link href={PORTFOLIO_URL} target="_blank">
                    <Text style={styles.developerLink}> Matías Pendino</Text>
                </Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: colors.backgroundElevated,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        gap: spacing.xl,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceBorder,
    },
    row: {
        width: '100%',
        gap: spacing.lg,
    },
    rowWeb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowMobile: {
        flexDirection: 'column',
    },
    brandCol: {
        flex: 1,
        maxWidth: 320,
    },
    logo: {
        width: 50,
        height: 50,
        marginStart: -8,
    },
    brandName: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
    },
    tagline: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
        marginTop: spacing.sm,
        lineHeight: 18,
    },
    linksCol: {
        flex: 1,
    },
    colTitle: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleSmall,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.md,
    },
    link: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodySmall,
        marginBottom: spacing.sm,
    },
    socialCol: {
        flex: 1,
    },
    socialRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    socialBadge: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.sm,
    },
    socialText: {
        color: colors.background,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    copy: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelSmall,
        textAlign: 'center',
    },
    developerLink: {
        color: colors.accent,
    },
});
