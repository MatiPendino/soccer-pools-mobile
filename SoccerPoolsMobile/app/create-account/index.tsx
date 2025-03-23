import { Pressable, ScrollView, Text, Image, ActivityIndicator, View } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import handleError from "../../utils/handleError";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { register, login, googleOauth2SignIn, getUserInLeague } from "../../services/authService";
import styles from "./styles";
import { Email } from "../../types";
import { useTranslation } from "react-i18next";

export default function CreateAccount({}) {
    const { t, i18n } = useTranslation()
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<Email>('')
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
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
        redirectUri: AuthSession.makeRedirectUri({
            scheme: 'com.matipendino2001.soccerpools',
        }),
    })

    useEffect(() => {
        googleAuth();
    }, [response])

    const googleAuth = async () => {    
        if (response) {
            if (response.type === "success") { 
                try {
                   const {access, refresh} = await googleOauth2SignIn(response.authentication.accessToken)
                    await userInLeague(access) 
                } catch (error) {
                    toast.show('There`s been an error signing in. Please try again or use a different authentication method', {type: 'danger'})
                }
            } else {
                toast.show("Google login cancelled!", { type: "warning" })
            }
        }
    }

    return (
        <View style={styles.viewContainer}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.createTxt}>
                    {t('create-your-account')}
                </Text>

                <Pressable 
                    onPress={() => promptAsync()}
                    style={styles.googleBtn}
                >
                    <View style={styles.googleContainer}>
                        <Text style={styles.googleTxt}>{t('sign-up-with')}</Text>
                        <Image
                            source={require('../../assets/img/google-icon.webp')}
                            style={styles.googleImg}
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
        </View>
    )
}