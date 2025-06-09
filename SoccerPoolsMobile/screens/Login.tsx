import { useState, useEffect } from "react"
import { ToastType, useToast } from "react-native-toast-notifications"
import { View, Image, Pressable, StyleSheet, Text, TouchableOpacity, Platform } from "react-native"
import { Link, Router, useRouter } from 'expo-router';
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Sentry from '@sentry/react-native';
import { useTranslation } from "react-i18next";
import { MAIN_COLOR } from "../constants";
import { googleOauth2SignIn, login } from '../services/authService'
import { getUserInLeague } from "../services/authService";
import CustomInputSign from '../components/CustomInputSign';
import CustomButton from '../components/CustomButton';
import handleError from "../utils/handleError";
import ForgotPasswordModal from "../modals/ForgotPasswordModal";

// This is crucial for web OAuth to work properly
if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

export default function Login({}) {
    const { t } = useTranslation()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const router: Router = useRouter()
    const toast: ToastType = useToast()

    const userInLeague = async (token: string): Promise<void> => {
        const inLeague = await getUserInLeague(token)
        if (inLeague.in_league) {
            router.replace('/home')
        } else {
            router.replace('/select-league')
        }
    }

    const logIn = async (): Promise<void> => {
        try {
            const {access, refresh} = await login(username.trim(), password.trim())
            toast.show(t('logged-in-successfully'), {type: 'success'})
            await userInLeague(access)
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'})
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
    })

    useEffect(() => {
        googleAuth()
    }, [response])

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
        <View style={styles.container}>
            <Image 
                source={require("../assets/icon-no-bg.png")}
                style={styles.image}
            />
    
            <CustomInputSign
                value={username}
                setValue={setUsername}
                placeholder={t('username')}
            />

            <CustomInputSign
                value={password}
                setValue={setPassword}
                placeholder={t('password')}
                isSecureTextEntry={true}
            />
            
            <CustomButton callable={logIn} btnText={t('log-in')} btnColor='#2F2766' />

            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.forgotCreateText}>{t('forgot-password')}</Text>
            </TouchableOpacity>

            <ForgotPasswordModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            <Link href='/create-account' style={styles.forgotCreateText}>{t('create-account')}</Link>

            <Pressable
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading || !request}
                style={[styles.googleContainer, (isGoogleLoading || !request) && styles.googleContainerDisabled]}
            >
                <Image
                    source={require('../assets/img/google-icon.webp')}
                    style={[styles.googleImg, (isGoogleLoading || !request) && styles.googleImgDisabled]}
                />
                {isGoogleLoading && <Text style={styles.loadingText}>Signing in...</Text>}
            </Pressable>
        </View>   
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 320,
        height: 320
    },
    forgotCreateText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 13
    },
    googleImg: {
        width: 67,
        height: 67,
        marginTop: 30
    },
    googleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    googleContainerDisabled: {
        opacity: 0.5,
    },
    googleImgDisabled: {
        opacity: 0.5,
    },
    loadingText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 8,
        fontWeight: 'bold',
    },
})