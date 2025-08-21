import { useEffect, useState } from 'react';
import { Platform, Pressable, Image, View, Text, StyleSheet } from 'react-native'
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import { Router, useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as Sentry from '@sentry/react-native';
import { googleOauth2SignIn, login } from 'services/authService';
import { getUserInLeague } from 'services/authService';
import { toCapitalCase } from 'utils/helper';
import { useBreakpoint } from '../hooks/useBreakpoint';

interface GoogleAuthButtonProps {
    isLogIn?: boolean;
    isHome?: boolean
}

export default function GoogleAuthButton ({isLogIn=true, isHome=false}: GoogleAuthButtonProps) {
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
    const toast: ToastType = useToast();
    const router: Router = useRouter();
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();

    const userInLeague = async (token: string): Promise<void> => {
        const inLeague = await getUserInLeague(token)
        if (inLeague.in_league) {
            router.replace('/home')
        } else {
            router.replace('/select-league')
        }
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID,
        webClientId: process.env.WEB_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
          // For web, use the current origin. For mobile, use custom scheme
          scheme: Platform.OS !== 'web' ? 'com.matipendino2001.soccerpools' : undefined,
          // @ts-ignore
          useProxy: Platform.OS === 'web'
        }),
        responseType: Platform.OS === 'web' ? AuthSession.ResponseType.Token : AuthSession.ResponseType.Code
    });

    useEffect(() => {
        googleAuth();
    }, [response]);

    const googleAuth = async () => {
        if (response?.type === 'success') {
            setIsGoogleLoading(true)
            try {
                const accessToken = response.authentication?.accessToken
                if (accessToken) {
                    const { access, refresh } = await googleOauth2SignIn(accessToken)
                    await userInLeague(access)
                } else {
                    Sentry.captureException('No access token received from Google')
                    toast.show('No access token received from Google', { type: 'danger' })
                }
            } catch (error) {
                Sentry.captureException(error)
                toast.show('There is been an error signing in. Please try again or use another method', {
                    type: 'danger',
                })
            } finally {
                setIsGoogleLoading(false)
            }
        } else if (response?.type === 'error') {
            Sentry.captureException(response.error?.message || 'Google login error')
            toast.show(`Google login failed: ${response.error?.message || 'Unknown error'}`, { type: 'danger' })
        } else if (response?.type === 'cancel') {
            toast.show('Google login cancelled!', { type: 'warning' })
        }
    }
    
    const handleGoogleSignIn = async () => {
        if (!request) {
            toast.show('Google sign-in is not ready yet. Please wait a moment and try again.', { type: 'warning' })
            return
        }

        setIsGoogleLoading(true)
        try {
            const result = await promptAsync({
                // @ts-ignore
                useProxy: Platform.OS === 'web',
                showInRecents: false,
            })

            // The response will be handled by the useEffect above
            if (result.type === 'dismiss') {
                setIsGoogleLoading(false)
            }
        } catch (error) {
            console.error('Error initiating Google sign-in:', error)
            toast.show('Failed to start Google sign-in. Please try again.', { type: 'danger' })
            setIsGoogleLoading(false)
        }
    }
    

    return (
        <Pressable
            onPress={handleGoogleSignIn}
            disabled={isGoogleLoading || !request}
            style={[
                styles.googleBtn, 
                (isGoogleLoading || !request) && styles.googleContainerDisabled,
                { width: isLG ? 310 : isHome ? '100%' : '90%' }
            ]}
        >
            <View style={styles.googleContainer}>
                <Text style={styles.googleTxt}>
                    {
                        isLogIn
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