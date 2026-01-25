import {
    ScrollView, Text, View, Platform, Alert, KeyboardAvoidingView, StyleSheet, Image
 } from 'react-native';
import { Link, Router, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ToastType, useToast } from 'react-native-toast-notifications';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { removeToken } from 'services/api';
import { getToken } from 'utils/storeToken';
import { getUserLeagueRoute } from 'utils/getUserLeagueRoute';
import GoogleAuthButton from 'components/GoogleAuthButton';
import Footer from 'components/footer/Footer';
import { Navbar, BackgroundDecoration } from '../../components/landing';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useRegister } from '../../hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../../theme';
import handleError from '../../utils/handleError';
import { ThemedInput, ThemedButton, ThemedLoader } from '../../components/ui';
import { Email } from '../../types';

if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

export default function CreateAccount() {
    const { t } = useTranslation();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<Email>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const toast: ToastType = useToast();
    const router: Router = useRouter();
    const { isLG } = useBreakpoint();
    const { referralCode } = useLocalSearchParams();

    const { mutate: registerUser, isPending: isRegistering } = useRegister();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getToken();
            if (token) {
                try {
                    router.replace(await getUserLeagueRoute(token));
                } catch (error) {
                    Alert.alert('Error', handleError(error), [{ text: 'OK' }]);
                    await removeToken();
                }
            }
        };
        checkAuth();
    }, []);

    const createAccount = () => {
        registerUser(
            {
                name: firstName.trim(),
                last_name: lastName.trim(),
                username: username.trim(),
                email: email.trim(),
                password: password.trim(),
                referralCode: referralCode ? (
                    Array.isArray(referralCode) ? referralCode[0] : referralCode
                ) : '',
            },
            {
                onSuccess: (status) => {
                    if (status === 201) {
                        toast.show(t('check-email'), { type: 'success' });
                        setEmail('');
                        setFirstName('');
                        setLastName('');
                        setUsername('');
                        setPassword('');
                    }
                },
                onError: (error) => {
                    toast.show(handleError(error.message), { type: 'danger' });
                },
            }
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
            {Platform.OS === 'web' && (
                <Navbar variant="create-account" referralCode={referralCode} />
            )}

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.contentContainer, { paddingTop: isLG ? 80 : 40 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <BackgroundDecoration variant="create-account" />

                <View style={[styles.mainContent, isLG && styles.mainContentLG]}>
                    {/* Left Side (Desktop only) */}
                    {isLG && (
                        <View style={styles.decorativeSection}>
                            <View style={styles.decorativeCard}>
                                <View style={styles.decorativeIconWrap}>
                                    <Ionicons name="trophy" size={48} color={colors.accent} />
                                </View>
                                <Text style={styles.decorativeTitle}>{t('ready-to-be-1')} {t('ready-to-be-2')}?</Text>
                                <Text style={styles.decorativeSubtitle}>{t('cta-subtitle')}</Text>

                                <View style={styles.featuresList}>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconWrap}>
                                            <Ionicons name="checkmark" size={16} color={colors.accent} />
                                        </View>
                                        <Text style={styles.featureText}>
                                            {t('feature-private-groups')}
                                        </Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconWrap}>
                                            <Ionicons name="checkmark" size={16} color={colors.accent} />
                                        </View>
                                        <Text style={styles.featureText}>{t('feature-stats')}</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconWrap}>
                                            <Ionicons name="checkmark" size={16} color={colors.accent} />
                                        </View>
                                        <Text style={styles.featureText}>
                                            {t('feature-notifications')}
                                        </Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <View style={styles.featureIconWrap}>
                                            <Ionicons name="checkmark" size={16} color={colors.accent} />
                                        </View>
                                        <Text style={styles.featureText}>
                                            {t('feature-game-modes')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Right Side */}
                    <View style={[styles.formSection, isLG && styles.formSectionLG]}>
                        <View style={styles.formCard}>
                            <View style={styles.headerSection}>
                                {!isLG && (
                                    <Image
                                        source={require('../../assets/icon-no-bg.png')}
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={styles.titleText}>{t('create-your-account')}</Text>
                                <Text style={styles.subtitleText}>{t('join-and-start')}</Text>
                            </View>

                            {/* Form */}
                            <View style={styles.formFields}>
                                {/* Google Auth */}
                                <GoogleAuthButton
                                    referralCode={referralCode ? (
                                        Array.isArray(referralCode) ? referralCode[0] : referralCode
                                    ) : ''}
                                    callingRoute="login"
                                />

                                {/* Divider */}
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>{t('or')}</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Form Fields */}
                                <View style={styles.nameRow}>
                                    <View style={styles.nameField}>
                                        <ThemedInput
                                            placeholder="John"
                                            label={t('first-name')}
                                            value={firstName}
                                            setValue={setFirstName}
                                            isCapitalized
                                        />
                                    </View>
                                    <View style={styles.nameField}>
                                        <ThemedInput
                                            placeholder="Doe"
                                            label={t('last-name')}
                                            value={lastName}
                                            setValue={setLastName}
                                            isCapitalized
                                        />
                                    </View>
                                </View>

                                <ThemedInput
                                    placeholder="Choose a username"
                                    label={t('username')}
                                    value={username}
                                    setValue={setUsername}
                                />

                                <ThemedInput
                                    placeholder="your@email.com"
                                    label={t('email')}
                                    value={email}
                                    setValue={setEmail}
                                    inputMode="email"
                                />

                                <ThemedInput
                                    placeholder="Create a password"
                                    label={t('password')}
                                    value={password}
                                    setValue={setPassword}
                                    isSecureTextEntry
                                />

                                {isRegistering ? (
                                    <ThemedLoader />
                                ) : (
                                    <ThemedButton 
                                        onPress={createAccount} 
                                        label={t('create-account')} 
                                        variant="primary" size="lg" fullWidth 
                                    />
                                )}

                                {/* Login Link */}
                                <View style={styles.loginSection}>
                                    <Text style={styles.hasAccountText}>{t('already-account')}</Text>
                                    <Link 
                                        href={`/login?referralCode=${referralCode || ''}`} 
                                        style={styles.loginLink}
                                    >
                                        {t('log-in')}
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {Platform.OS === 'web' && (
                    <View style={styles.footerSection}>
                        <Footer />
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: 80,
    },

    // Main Content
    mainContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 700,
    },
    mainContentLG: {
        flexDirection: 'row',
        maxWidth: 1000,
        marginHorizontal: 'auto',
        gap: spacing.xxl,
    },

    // Decorative Section
    decorativeSection: {
        flex: 1,
        justifyContent: 'center',
        paddingRight: spacing.xl,
    },
    decorativeCard: {
        backgroundColor: 'rgba(0, 212, 170, 0.05)',
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(0, 212, 170, 0.2)',
    },
    decorativeIconWrap: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    decorativeTitle: {
        fontSize: typography.fontSize.headlineLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    decorativeSubtitle: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    featuresList: {
        gap: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    featureIconWrap: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.accentMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: typography.fontSize.bodyMedium,
        color: colors.textSecondary,
    },

    // Form Section
    formSection: {
        width: '100%',
        maxWidth: 450,
    },
    formSectionLG: {
        flex: 1,
        maxWidth: 450,
    },
    formCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: spacing.md,
    },
    titleText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.headlineMedium,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    subtitleText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
    },
    formFields: {
        width: '100%',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.surfaceBorder,
    },
    dividerText: {
        color: colors.textMuted,
        fontSize: typography.fontSize.labelMedium,
        marginHorizontal: spacing.md,
    },
    nameRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    nameField: {
        flex: 1,
    },
    loginSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
        gap: spacing.xs,
    },
    hasAccountText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
    },
    loginLink: {
        color: colors.accent,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    footerSection: {
        marginTop: spacing.xxl,
        width: '100%',
    },
});
