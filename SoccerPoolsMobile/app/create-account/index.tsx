import { Pressable, ScrollView, Text, Image, ActivityIndicator, View, Platform } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Sentry from '@sentry/react-native';
import handleError from "../../utils/handleError";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { register, googleOauth2SignIn, getUserInLeague } from "../../services/authService";
import styles from "./styles";
import { Email } from "../../types";
import { useTranslation } from "react-i18next";

// This is crucial for web OAuth to work properly
if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

export default function CreateAccount({}) {
    const { t, i18n } = useTranslation()
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<Email>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const toast = useToast()
    const router = useRouter()

    const userInLeague = async (token: string): Promise<void> => {
        const inLeague = await getUserInLeague(token)
        if (inLeague.in_league) {
            router.replace('/home')
        } else {
            router.replace('/select-league')
        }
    }

    const createAccount = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const registerStatus = await register(
                firstName.trim(), lastName.trim(), username.trim(), email.trim(), password.trim()
            )
            if (registerStatus === 201) {
                toast.show(t('check-email'), {type: 'success'})
                setEmail('')
                setFirstName('')
                setLastName('')
                setUsername('')
                setPassword('')
            }
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'})
        } finally {
            setIsLoading(false)
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
        googleAuth();
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
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
        >
            <Text style={styles.createTxt}>
                {t('create-your-account')}
            </Text>

            <Pressable
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading || !request}
                style={[styles.googleBtn, (isGoogleLoading || !request) && styles.googleContainerDisabled]}
            >
                <View style={styles.googleContainer}>
                    <Text style={styles.googleTxt}>{t('sign-up-with')}</Text>
                    <Image
                        source={require('../../assets/img/google-icon.webp')}
                        style={[styles.googleImg, (isGoogleLoading || !request) && styles.googleImgDisabled]}
                    />
                </View>
            </Pressable>

            <View style={styles.separationContainer}>
                <View style={styles.whiteLine}></View>
                <Text style={styles.orTxt}>{t('or')}</Text>
                <View style={styles.whiteLine}></View>
            </View>

            <CustomInputSign
                placeholder={t('first-name')}
                value={firstName}
                setValue={setFirstName}
                isCapitalized={true}
            />

            <CustomInputSign
                placeholder={t('last-name')}
                value={lastName}
                setValue={setLastName}
                isCapitalized={true}
            />

            <CustomInputSign
                placeholder={t('username')}
                value={username}
                setValue={setUsername}
            />

            <CustomInputSign
                placeholder={t('email')}
                value={email}
                setValue={setEmail}
                inputMode="email"
            />

            <CustomInputSign
                placeholder={t('password')}
                value={password}
                setValue={setPassword}
                isSecureTextEntry={true}
            />

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={createAccount} btnText={t('create-account')} btnColor='#2F2766' />
            }

            <Link href='/' style={styles.alreadyTxt}>{t('already-account')}</Link>
        </ScrollView>    
    )
}