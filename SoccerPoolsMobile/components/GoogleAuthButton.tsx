import { useEffect } from 'react';
import { Platform, Pressable, Image, View, Text, StyleSheet } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as Sentry from '@sentry/react-native';
import { toCapitalCase } from 'utils/helper';
import handleError from 'utils/handleError';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { useGoogleSignIn } from '../hooks/useUser';

interface GoogleAuthButtonProps {
    callingRoute: 'home' | 'login';
    referralCode?: string  | string[];
}

export default function GoogleAuthButton ({callingRoute, referralCode}: GoogleAuthButtonProps) {
    const toast: ToastType = useToast();
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();

    const { mutate: googleSignIn, isPending: isGoogleLoading } = useGoogleSignIn();

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID,
        webClientId: process.env.WEB_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
          // For web, use the current origin. For mobile, use custom scheme
          scheme: Platform.OS !== 'web' ? 'com.matipendino2001.soccerpools' : undefined,
          // @ts-ignore
          useProxy: Platform.OS === 'web'
        }),
        responseType: (
            Platform.OS === 'web' ? 
            AuthSession.ResponseType.Token : 
            AuthSession.ResponseType.Code
        )
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const accessToken = response.authentication?.accessToken;
            if (accessToken) {
                googleSignIn({
                    accessToken,
                    referralCode: (
                        referralCode && referralCode.length > 0 ? 
                        referralCode.toString() : 
                        undefined
                    )
                }, {
                    onError: (error) => {
                        toast.show(handleError(error.message), { type: 'danger' });
                    }
                });
            } else {
                Sentry.captureException('No access token received from Google');
                toast.show('No access token received from Google', { type: 'danger' });
            }
        } else if (response?.type === 'error') {
            Sentry.captureException(response.error?.message || 'Google login error');
            toast.show(
                `Google login failed: ${response.error?.message || 'Unknown error'}`, 
                { type: 'danger' }
            );
        } else if (response?.type === 'cancel') {
            toast.show('Google login cancelled!', { type: 'warning' });
        }
    }, [response]);

    const handleGoogleSignIn = async () => {
        if (!request) {
            toast.show(
                'Google sign-in is not ready yet. Please wait a moment and try again.', 
                { type: 'warning' }
            );
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
    }
    

    return (
        <Pressable
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading || !request}
            style={[
                styles.googleBtn, 
                (isGoogleLoading || !request) && styles.googleContainerDisabled,
                { width: isLG ? 310 : callingRoute === 'home' ? '100%' : '90%' }
            ]}
        >
            <View style={styles.googleContainer}>
                <Text style={styles.googleTxt}>
                    {
                        callingRoute === 'login'
                        ?
                        t('log-in-with')
                        :
                        toCapitalCase(t('sign-up-with'))
                    }
                </Text>
                <Image
                    source={require('../assets/img/google-icon.webp')}
                    style={[styles.googleImg, (isGoogleLoading || !request) && styles.googleImgDisabled]}
                />
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    googleContainerDisabled: {
        opacity: 0.5,
    },
    googleImgDisabled: {
        opacity: 0.5,
    },
    googleBtn: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 20
    },
    googleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    googleTxt: {
        color: 'black',
        fontWeight: 500,
        marginEnd: 8,
        fontSize: 17
    },
    googleImg: {
        width: 42,
        height: 42
    },
});