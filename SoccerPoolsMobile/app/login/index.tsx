import React, { useState, useEffect } from 'react';
import { ToastType, useToast } from 'react-native-toast-notifications';
import {
    View, Image, StyleSheet, Text, Pressable, Platform, ScrollView, Alert, KeyboardAvoidingView
} from 'react-native';
import { Link, Router, useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Footer from 'components/footer/Footer';
import GoogleAuthButton from 'components/GoogleAuthButton';
import { removeToken } from 'services/api';
import handleError from 'utils/handleError';
import { getToken } from 'utils/storeToken';
import { getUserLeagueRoute } from 'utils/getUserLeagueRoute';
import { ThemedInput, ThemedButton, ThemedLoader } from '../../components/ui';
import { Navbar, BackgroundDecoration } from '../../components/landing';
import ForgotPasswordModal from '../../modals/ForgotPasswordModal';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useLogin } from '../../hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../../theme';

if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

export default function Login() {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const router: Router = useRouter();
    const toast: ToastType = useToast();
    const { isLG } = useBreakpoint();
    const { referralCode } = useLocalSearchParams();

    const { mutate: loginUser, isPending: isLoggingIn } = useLogin();

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

    const logIn = () => {
        loginUser({ username: username.trim(), password: password.trim() }, {
            onSuccess: async (data) => {
                toast.show(t('logged-in-successfully'), { type: 'success' });
                router.replace(await getUserLeagueRoute(data.access));
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
            {Platform.OS === 'web' && (
                <Navbar variant="login" referralCode={referralCode} />
            )}

            <ScrollView
                style={styles.container}
                contentContainerStyle={[styles.contentContainer, { paddingTop: isLG ? 80 : 40 }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <BackgroundDecoration variant="login" />

                <View style={[styles.mainContent, isLG && styles.mainContentLG]}>
                    {/* Left Side (Desktop only) */}
                    {isLG && (
                        <View style={styles.decorativeSection}>
                            <View style={styles.decorativeCard}>
                                <View style={styles.decorativeIconWrap}>
                                    <Ionicons name="football" size={48} color={colors.accent} />
                                </View>
                                <Text style={styles.decorativeTitle}>
                                    {t('hero-title-1')} {t('hero-title-2')}
                                </Text>
                                <Text style={styles.decorativeSubtitle}>{t('hero-subtitle')}</Text>

                                <View style={styles.statsRow}>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statNumber}>10K+</Text>
                                        <Text style={styles.statLabel}>{t('users')}</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statNumber}>500+</Text>
                                        <Text style={styles.statLabel}>{t('tournaments')}</Text>
                                    </View>
                                    <View style={styles.statItem}>
                                        <Text style={styles.statNumber}>10+</Text>
                                        <Text style={styles.statLabel}>{t('leagues')}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Right Side */}
                    <View style={[styles.formSection, isLG && styles.formSectionLG]}>
                        <View style={styles.formCard}>
                            {/* Logo Section */}
                            <View style={styles.logoSection}>
                                {!isLG && (
                                    <Image
                                        source={require('../../assets/icon-no-bg.png')}
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                )}
                                <Text style={styles.welcomeText}>{t('log-in')}</Text>
                                <Text style={styles.subtitleText}>{t('enter-your-credentials')}</Text>
                            </View>

                            {/* Form Fields */}
                            <View style={styles.formFields}>
                                <ThemedInput
                                    value={username}
                                    setValue={setUsername}
                                    placeholder="Enter your username"
                                    label={t('username')}
                                />

                                <ThemedInput
                                    value={password}
                                    setValue={setPassword}
                                    placeholder="Enter your password"
                                    label={t('password')}
                                    isSecureTextEntry
                                />

                                <Pressable 
                                    onPress={() => setModalVisible(true)} 
                                    style={styles.forgotButton}
                                >
                                    <Text style={styles.forgotText}>{t('forgot-password')}</Text>
                                </Pressable>

                                {isLoggingIn ? (
                                    <ThemedLoader />
                                ) : (
                                    <ThemedButton
                                        onPress={logIn}
                                        label={t('log-in')}
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                    />
                                )}

                                {/* Divider */}
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>or</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                {/* Google Auth */}
                                <GoogleAuthButton
                                    callingRoute="login"
                                    referralCode={referralCode ? (
                                        Array.isArray(referralCode) ? referralCode[0] : referralCode
                                    ) : ''}
                                />

                                {/* Create Account Link */}
                                <View style={styles.createAccountSection}>
                                    <Text style={styles.noAccountText}>
                                        {t('dont-have-account')}
                                    </Text>
                                    <Link
                                        href={`/create-account?referralCode=${referralCode || ''}`}
                                        style={styles.createAccountLink}
                                    >
                                        {t('create-account')}
                                    </Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <ForgotPasswordModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />

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
    },

    // Main Content
    mainContent: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 600,
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
    statsRow: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: typography.fontSize.titleLarge,
        fontWeight: typography.fontWeight.bold,
        color: colors.accent,
    },
    statLabel: {
        fontSize: typography.fontSize.labelSmall,
        color: colors.textMuted,
    },

    // Form Section
    formSection: {
        width: '100%',
        maxWidth: 420,
    },
    formSectionLG: {
        flex: 1,
        maxWidth: 420,
    },
    formCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: spacing.md,
    },
    welcomeText: {
        color: colors.textPrimary,
        fontSize: typography.fontSize.headlineMedium,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    subtitleText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
    },
    formFields: {
        width: '100%',
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
        marginTop: -spacing.sm,
    },
    forgotText: {
        color: colors.accent,
        fontSize: typography.fontSize.labelMedium,
        fontWeight: typography.fontWeight.medium,
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
    createAccountSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
        gap: spacing.xs,
    },
    noAccountText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.bodyMedium,
    },
    createAccountLink: {
        color: colors.accent,
        fontSize: typography.fontSize.bodyMedium,
        fontWeight: typography.fontWeight.semibold,
    },
    footerSection: {
        marginTop: spacing.xxl,
        width: '100%',
    },
});
