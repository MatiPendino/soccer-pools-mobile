import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { 
  ANDROID_URL, INSTAGRAM_URL, MAIN_COLOR, PORTFOLIO_URL, PURPLE_COLOR, TWITTER_URL
} from '../../constants';
import { toCapitalCase } from 'utils/helper';
import { useBreakpoint } from '../../hooks/useBreakpoint';

export default function Footer() {
  const { isSM, isLG } = useBreakpoint();
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const QUICK_LINKS = [
    { label: toCapitalCase(t('log-in')), href: '/login' },
    { label: toCapitalCase(t('create-account')), href: '/create-account' },
    { label: t('download-app'), href: ANDROID_URL },
    { label: toCapitalCase(t('see-prizes')), href: '/prizes'}
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
          <Text style={[styles.tagline, { marginBottom: isSM ? 40 : 0}]}>
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
              <Link
                key={label}
                href={href}
                style={styles.socialBadge}
                target='_blank'
              >
                <Text style={styles.socialText}>{label}</Text>
              </Link>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.copy}>
        © {year} ProdeApp. {t('all-rights-reserved')} {t('developed-by')} 
        <Link href={PORTFOLIO_URL} target='_blank'><Text style={{color: '#FFFFFF'}}> Matías Pendino</Text></Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: PURPLE_COLOR,
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 32,
  },
  row: {
    width: '100%',
    gap: 24,
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
    width: 60,
    height: 60,
    marginStart: -10,
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  tagline: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 14,
    marginTop: 8,
    lineHeight: 18,
  },
  linksCol: {
    flex: 1,
  },
  colTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  link: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: 14,
    marginBottom: 6,
  },
  socialCol: {
    flex: 1,
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  socialBadge: {
    backgroundColor: MAIN_COLOR,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  socialText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  copy: {
    color: '#FFFFFF',
    opacity: 0.6,
    fontSize: 12,
    textAlign: 'center',
  },
});
