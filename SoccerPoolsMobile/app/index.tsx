import { useEffect } from 'react';
import { 
    SafeAreaView, View, Text, ScrollView, StyleSheet, Platform, Pressable, Image, ImageBackground 
} from 'react-native';
import { Router, useRouter, Link, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import InitialLoadingScreen from 'components/InitialLoadingScreen';
import Footer from '../components/footer/Footer';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useUser } from '../hooks/useUser';
import { useUserLeague } from '../hooks/useLeagues';
import { colors, spacing, typography, borderRadius } from '../theme';

if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

export default function LandingScreen() {
    const { isMD, isLG } = useBreakpoint();
    const router: Router = useRouter();
    const { t } = useTranslation();
    const { referralCode } = useLocalSearchParams();

    const { data: user, isLoading: isUserLoading } = useUser();
    const { data: league, isLoading: isLeagueLoading } = useUserLeague();

    useEffect(() => {
        if (user) {
            if (league && league.id) {
                router.replace('/home');
            } else if (!isLeagueLoading) {
                router.replace('/select-league');
            }
        }
    }, [user, league, isLeagueLoading]);

    if (isUserLoading || (user && isLeagueLoading)) {
        return <InitialLoadingScreen />;
    }

    const howItWorksSteps = [
        { icon: 'person-add-outline', title: t('landing-step-1-title'), desc: t('landing-step-1-desc') },
        { icon: 'football-outline', title: t('landing-step-2-title'), desc: t('landing-step-2-desc') },
        { icon: 'trending-up-outline', title: t('landing-step-3-title'), desc: t('landing-step-3-desc') },
        { icon: 'gift-outline', title: t('landing-step-4-title'), desc: t('landing-step-4-desc') },
    ];

    const leagues = [
        { flag: require('../assets/img/spain.png'), name: 'La Liga', country: t('spain') },
        { flag: require('../assets/img/england.png'), name: 'Premier League', country: t('england') },
        { flag: require('../assets/img/italy.png'), name: 'Serie A', country: t('italy') },
        { flag: require('../assets/img/germany.png'), name: 'Bundesliga', country: t('germany') },
        { flag: require('../assets/img/mexico.png'), name: 'Liga MX', country: t('mexico') },
        { flag: require('../assets/img/argentina.png'), name: 'Liga Argentina', country: t('argentina') },
        { flag: require('../assets/img/champions.png'), name: 'Champions League', country: t('europe') },
        { flag: require('../assets/img/libertadores.png'), name: 'Libertadores', country: t('south-america') },
    ];

    const features = [
        { icon: 'people-outline', title: t('feature-private-groups'), desc: t('feature-private-groups-desc') },
        { icon: 'stats-chart-outline', title: t('feature-stats'), desc: t('feature-stats-desc') },
        { icon: 'notifications-outline', title: t('feature-notifications'), desc: t('feature-notifications-desc') },
        { icon: 'phone-portrait-outline', title: t('feature-responsive'), desc: t('feature-responsive-desc') },
        { icon: 'shield-checkmark-outline', title: t('feature-secure'), desc: t('feature-secure-desc') },
        { icon: 'game-controller-outline', title: t('feature-game-modes'), desc: t('feature-game-modes-desc') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Navigation Bar */}
                <View style={[styles.navbar, isLG && styles.navbarLG]}>
                    <View style={styles.navBrand}>
                        <View style={styles.navLogoContainer}>
                            <Ionicons name="football" size={20} color={colors.accent} />
                        </View>
                        <Text style={styles.navBrandText}>ProdeApp</Text>
                    </View>

                    {isLG && (
                        <View style={styles.navActions}>
                            <Link href={`/login?referralCode=${referralCode || ''}`}>
                                <Text style={styles.navLoginText}>{t('log-in')}</Text>
                            </Link>
                            <Link href={`/create-account?referralCode=${referralCode || ''}`}>
                                <View style={styles.navRegisterBtn}>
                                    <Text style={styles.navRegisterText}>{t('register').toUpperCase()}</Text>
                                </View>
                            </Link>
                        </View>
                    )}
                </View>

                {/* HERO SECTION */}
                <ImageBackground
                    source={require('../assets/img/hero-bg.jpg')}
                    style={styles.heroSection}
                    resizeMode="cover"
                >
                    <View style={styles.heroOverlay} />

                    {/* Hero Content */}
                    <View style={[styles.heroContent, isLG && styles.heroContentLG]}>
                        {/* Active Users Badge */}
                        <View style={styles.activeUsersBadge}>
                            <Ionicons name="sparkles" size={14} color={colors.accent} />
                            <Text style={styles.activeUsersText}>{t('active-users-badge')}</Text>
                        </View>

                        {/* Main Title */}
                        <Text style={[styles.heroTitle, isLG && styles.heroTitleLG]}>
                            {t('hero-title-1')}{' '}
                            <Text style={styles.heroTitleAccent}>{t('hero-title-2')}</Text>
                        </Text>

                        <Text style={[styles.heroSubtitle, isLG && styles.heroSubtitleLG]}>
                            {t('hero-subtitle')}
                        </Text>

                        {/* CTA Buttons */}
                        <View style={[styles.ctaContainer, isLG && styles.ctaContainerRow]}>
                            {isLG ? (
                                <Link href={`/create-account?referralCode=${referralCode || ''}`}>
                                    <Pressable style={[styles.ctaButton, styles.ctaPrimary]}>
                                        <Text style={styles.ctaPrimaryText}>{t('start-free')}</Text>
                                        <Ionicons name="arrow-forward" size={18} color={colors.background} />
                                    </Pressable>
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        style={[
                                            styles.ctaButton, 
                                            styles.ctaSecondary, 
                                            { justifyContent: 'center', textAlign: 'center' }
                                        ]} 
                                        href={`/login?referralCode=${referralCode || ''}`}
                                    >
                                        <Text style={styles.ctaSecondaryText}>{t('log-in')}</Text>
                                    </Link>
                                    <Link 
                                        href={`/create-account?referralCode=${referralCode || ''}`}
                                        style={[
                                            styles.ctaButton, 
                                            styles.ctaPrimary, 
                                            { textAlign: 'center' }
                                        ]}
                                    >
                                        <Text style={styles.ctaPrimaryText}>
                                            {t('register').toUpperCase()}
                                        </Text>
                                    </Link>
                                </>
                            )}
                        </View>

                        {/* Stats */}
                        <View style={[styles.statsContainer, isLG && styles.statsContainerLG]}>
                            <View style={styles.statItem}>
                                <Ionicons name="people-outline" size={20} color={colors.accent} />
                                <Text style={styles.statNumber}>10K+</Text>
                                <Text style={styles.statLabel}>{t('users')}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="trophy-outline" size={20} color={colors.accent} />
                                <Text style={styles.statNumber}>500+</Text>
                                <Text style={styles.statLabel}>{t('tournaments')}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="football-outline" size={20} color={colors.accent} />
                                <Text style={styles.statNumber}>10+</Text>
                                <Text style={styles.statLabel}>{t('leagues')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* HOW IT WORKS SECTION */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>{t('how-it-works-label')}</Text>
                            <Text style={[styles.sectionTitle, isLG && styles.sectionTitleLG]}>
                                {t('easy-as')}{' '}
                                <Text style={styles.sectionTitleAccent}>1, 2, 3</Text>
                            </Text>
                            <Text style={styles.sectionSubtitle}>{t('how-it-works-subtitle')}</Text>
                        </View>

                        <View style={[styles.stepsGrid, isLG && styles.stepsGridLG]}>
                            {howItWorksSteps.map((step, index) => (
                                <View key={index} style={[styles.stepCard, isLG && styles.stepCardLG]}>
                                    <View style={styles.stepNumberBadge}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.stepIconWrap}>
                                        <Ionicons 
                                            name={step.icon as any} 
                                            size={28} 
                                            color={colors.accent} 
                                        />
                                    </View>
                                    <Text style={styles.stepTitle}>{step.title}</Text>
                                    <Text style={styles.stepDesc}>{step.desc}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ImageBackground>



                {/* LEAGUES SECTION - Desktop Only */}
                {isLG && (
                    <View style={[styles.sectionContainer, styles.sectionDark]}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>{t('available-leagues-label')}</Text>
                            <Text style={[styles.sectionTitle, isLG && styles.sectionTitleLG]}>
                                {t('best-leagues-1')}{' '}
                                <Text style={styles.sectionTitleAccent}>{t('best-leagues-2')}</Text>
                            </Text>
                            <Text style={styles.sectionSubtitle}>{t('leagues-subtitle')}</Text>
                        </View>

                        <View style={[
                            styles.leaguesGrid, 
                            isMD && styles.leaguesGridMD, 
                            isLG && styles.leaguesGridLG
                        ]}>
                            {leagues.map((league, index) => (
                                <View key={index} 
                                    style={[
                                        styles.leagueCard, 
                                        isMD && styles.leagueCardMD, 
                                        isLG && styles.leagueCardLG
                                    ]}
                                >
                                    <Image 
                                        source={league.flag} 
                                        style={styles.leagueFlag} 
                                        resizeMode="contain" 
                                    />
                                    <Text style={styles.leagueName}>{league.name}</Text>
                                    <Text style={styles.leagueCountry}>{league.country}</Text>
                                </View>
                            ))}
                        </View>

                        <Text style={styles.moreLeaguesText}>{t('more-leagues-coming')}</Text>
                    </View>
                )}

                {/* FEATURES SECTION */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>{t('features-label')}</Text>
                        <Text style={[styles.sectionTitle, isLG && styles.sectionTitleLG]}>
                            {t('everything-you-need-1')}{' '}
                            <Text style={styles.sectionTitleAccent}>{t('everything-you-need-2')}</Text>
                        </Text>
                        <Text style={styles.sectionSubtitle}>{t('features-subtitle')}</Text>
                    </View>

                    <View style={[
                        styles.featuresGrid, 
                        isMD && styles.featuresGridMD, 
                        isLG && styles.featuresGridLG
                    ]}>
                        {features.map((feature, index) => (
                            <View key={index} style={[
                                styles.featureCard, 
                                isMD && styles.featureCardMD, 
                                isLG && styles.featureCardLG
                            ]}>
                                <View style={styles.featureIconWrap}>
                                    <Ionicons 
                                        name={feature.icon as any} 
                                        size={28} 
                                        color={colors.accent} 
                                    />
                                </View>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDesc}>{feature.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* CTA SECTION - Desktop Only */}
                {isLG && (
                    <View style={styles.ctaSectionContainer}>
                        <View style={[styles.ctaCardOuter, isLG && styles.ctaCardOuterLG]}>
                            <View style={[styles.ctaCard, isLG && styles.ctaCardLG]}>
                                <View style={styles.ctaIconWrap}>
                                    <Ionicons name="trophy-outline" size={32} color={colors.accent} />
                                </View>
                                <Text style={[styles.ctaTitle, isLG && styles.ctaTitleLG]}>
                                    {t('ready-to-be-1')}{' '}
                                    <Text style={styles.sectionTitleAccent}>{t('ready-to-be-2')}</Text>
                                    ?
                                </Text>
                                <Text style={styles.ctaSubtitle}>{t('cta-subtitle')}</Text>
                                <Link href={`/create-account?referralCode=${referralCode || ''}`}>
                                    <Pressable style={[
                                        styles.ctaButton,
                                        styles.ctaPrimary,
                                        styles.ctaButtonLarge
                                    ]}>
                                        <Text style={styles.ctaPrimaryText}>
                                            {t('create-free-account')}
                                        </Text>
                                        <Ionicons 
                                            name="arrow-forward" 
                                            size={18} 
                                            color={colors.background} 
                                        />
                                    </Pressable>
                                </Link>
                                <Text style={styles.ctaDisclaimer}>{t('cta-disclaimer')}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* FOOTER - WEB ONLY */}
                {Platform.OS === 'web' && <Footer />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flexGrow: 1,
    },

    // NAVBAR
    navbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingVertical: spacing.md,
        justifyContent: 'space-between',
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
    navLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xl,
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -100 }],
    },
    navLink: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
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

    // HERO
    heroSection: {
        minHeight: 700,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl + spacing.xl,
        paddingBottom: spacing.xxxl,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(10, 10, 15, 0.5)',
    },
    heroContent: {
        alignItems: 'center',
        maxWidth: 500,
        zIndex: 1,
    },
    heroContentLG: {
        maxWidth: 650,
    },
    activeUsersBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 212, 170, 0.15)',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
        marginBottom: spacing.lg,
    },
    activeUsersText: {
        color: colors.accent,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.medium,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: 44,
        marginBottom: spacing.md,
    },
    heroTitleLG: {
        fontSize: 52,
        lineHeight: 62,
    },
    heroTitleAccent: {
        color: colors.accent,
    },
    heroSubtitle: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
        maxWidth: 400,
    },
    heroSubtitleLG: {
        fontSize: typography.fontSize.bodyLarge,
        maxWidth: 500,
    },
    ctaContainer: {
        width: '100%',
        maxWidth: 340,
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    ctaContainerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        maxWidth: 400,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    ctaButtonLarge: {
        paddingVertical: spacing.md + 4,
        paddingHorizontal: spacing.xl,
    },
    ctaPrimary: {
        backgroundColor: '#00D4AA',
    },
    ctaPrimaryText: {
        color: colors.background,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    ctaSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    ctaSecondaryText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    ctaPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    statsContainerLG: {
        gap: spacing.xxl,
    },
    statItem: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    statNumber: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
    },
    statLabel: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelSmall,
    },

    // SECTIONS COMMON
    sectionContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xxxl,
    },
    sectionDark: {
        backgroundColor: colors.backgroundElevated,
    },
    sectionHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    sectionLabel: {
        color: colors.accent,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.headlineMedium,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    sectionTitleLG: {
        fontSize: typography.fontSize.displaySmall,
    },
    sectionTitleAccent: {
        color: colors.accent,
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: 500,
    },

    // HOW IT WORKS
    stepsGrid: {
        gap: spacing.md,
    },
    stepsGridLG: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: 1100,
        marginHorizontal: 'auto',
    },
    stepCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        position: 'relative',
    },
    stepCardLG: {
        flex: 1,
        minWidth: 220,
        maxWidth: 260,
    },
    stepNumberBadge: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        color: colors.accent,
        fontSize: typography.fontSize.labelSmall,
        fontWeight: typography.fontWeight.bold,
    },
    stepIconWrap: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    stepTitle: {
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    stepDesc: {
        fontSize: typography.fontSize.bodySmall,
        color: colors.textSecondary,
        lineHeight: 20,
    },

    // LEAGUES
    leaguesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
    },
    leaguesGridMD: {
        maxWidth: 700,
        marginHorizontal: 'auto',
    },
    leaguesGridLG: {
        maxWidth: 1000,
        marginHorizontal: 'auto',
        gap: spacing.md,
    },
    leagueCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        alignItems: 'center',
        width: '47%',
    },
    leagueCardMD: {
        width: '23%',
        minWidth: 140,
    },
    leagueCardLG: {
        width: '23%',
        minWidth: 160,
        maxWidth: 220,
    },
    leagueFlag: {
        width: 40,
        height: 40,
        marginBottom: spacing.sm,
    },
    leagueName: {
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
    },
    leagueCountry: {
        fontSize: typography.fontSize.labelSmall,
        color: colors.textMuted,
    },
    moreLeaguesText: {
        color: colors.textMuted,
        fontSize: typography.fontSize.bodySmall,
        textAlign: 'center',
        marginTop: spacing.xl,
    },

    // FEATURES
    featuresGrid: {
        gap: spacing.md,
    },
    featuresGridMD: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 700,
        marginHorizontal: 'auto',
    },
    featuresGridLG: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 1100,
        marginHorizontal: 'auto',
        gap: spacing.md,
    },
    featureCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    featureCardMD: {
        width: '47%',
        minWidth: 280,
    },
    featureCardLG: {
        width: '31%',
        minWidth: 300,
        maxWidth: 340,
    },
    featureIconWrap: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    featureTitle: {
        fontSize: typography.fontSize.titleMedium,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    featureDesc: {
        fontSize: typography.fontSize.bodySmall,
        color: colors.textSecondary,
        lineHeight: 20,
    },

    // CTA SECTION
    ctaSectionContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xxxl,
        backgroundColor: colors.backgroundElevated,
    },
    ctaCardOuter: {
        borderRadius: borderRadius.xl + 4,
        padding: 2,
        backgroundColor: 'rgba(0, 212, 170, 0.3)',
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 10,
    },
    ctaCardOuterLG: {
        maxWidth: 600,
        marginHorizontal: 'auto',
    },
    ctaCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
    },
    ctaCardLG: {
        padding: spacing.xxl,
    },
    ctaIconWrap: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    ctaTitle: {
        fontSize: typography.fontSize.headlineSmall,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    ctaTitleLG: {
        fontSize: typography.fontSize.headlineMedium,
    },
    ctaSubtitle: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        maxWidth: 400,
    },
    ctaDisclaimer: {
        fontSize: typography.fontSize.labelSmall,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});