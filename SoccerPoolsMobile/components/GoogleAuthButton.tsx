import { useEffect } from 'react';
import { Platform, Pressable, Image, View, Text, StyleSheet } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as Sentry from '@sentry/react-native';
import { toCapitalCase } from 'utils/helper';
import handleError from 'utils/handleError';
import { useGoogleSignIn } from '../hooks/useUser';
import { colors, spacing, typography, borderRadius } from '../theme';

interface GoogleAuthButtonProps {
    callingRoute: 'home' | 'login';
    referralCode?: string | string[];
}

export default function GoogleAuthButton({ callingRoute, referralCode }: GoogleAuthButtonProps) {
    const toast: ToastType = useToast();
    const { t } = useTranslation();

    const { mutate: googleSignIn, isPending: isGoogleLoading } = useGoogleSignIn();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID,
        webClientId: process.env.WEB_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
            scheme: Platform.OS !== 'web' ? 'com.matipendino2001.soccerpools' : undefined,
            // @ts-ignore
            useProxy: Platform.OS === 'web',
        }),
        responseType:
            Platform.OS === 'web' ? AuthSession.ResponseType.Token : AuthSession.ResponseType.Code,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const accessToken = response.authentication?.accessToken;
            if (accessToken) {
                googleSignIn(
                    {
                        accessToken,
                        referralCode:
                            referralCode && referralCode.length > 0 ? referralCode.toString() : undefined,
                    },
                    {
                        onError: (error) => {
                            toast.show(handleError(error.message), { type: 'danger' });
                        },
                    }
                );
            } else {
                Sentry.captureException('No access token received from Google');
                toast.show('No access token received from Google', { type: 'danger' });
            }
        } else if (response?.type === 'error') {
            Sentry.captureException(response.error?.message || 'Google login error');
            toast.show(`Google login failed: ${response.error?.message || 'Unknown error'}`, {
                type: 'danger',
            });
        } else if (response?.type === 'cancel') {
            toast.show('Google login cancelled!', { type: 'warning' });
        }
    }, [response]);

    const handleGoogleSignIn = async () => {
        if (!request) {
            toast.show('Google sign-in is not ready yet. Please wait a moment and try again.', {
                type: 'warning',
            });
            return;
        }

        try {
            await promptAsync({
                // @ts-ignore
                useProxy: Platform.OS === 'web',
                showInRecents: false,
            });
        } catch (error) {
            toast.show('Failed to start Google sign-in. Please try again.', { type: 'danger' });
        }
    };

    return (
        <Pressable
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading || !request}
            style={({ pressed }) => [
                styles.googleBtn,
                (isGoogleLoading || !request) && styles.googleBtnDisabled,
                pressed && styles.googleBtnPressed,
            ]}
        >
            <View style={styles.googleContent}>
                <Image
                    source={require('../assets/img/google-icon.webp')}
                    style={[styles.googleImg, (isGoogleLoading || !request) && styles.googleImgDisabled]}
                />
                <Text style={styles.googleTxt}>
                    {
                        callingRoute === 'login' 
                        ? 
                        t('log-in-with') 
                        : 
                        toCapitalCase(t('sign-up-with'))
                    } Google
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    googleBtn: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        width: '100%',
    },
    googleBtnDisabled: {
        opacity: 0.5,
    },
    googleBtnPressed: {
        opacity: 0.8,
    },
    googleContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    googleTxt: {
        color: colors.black,
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.bodyMedium,
    },
    googleImg: {
        width: 24,
        height: 24,
    },
    googleImgDisabled: {
        opacity: 0.5,
    },
});