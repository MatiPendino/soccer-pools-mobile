import { useState, useEffect } from "react"
import { useToast } from "react-native-toast-notifications"
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { googleOauth2SignIn, login } from '../services/authService'
import { getUserInLeague } from "../services/authService";
import CustomInputSign from '../components/CustomInputSign';
import CustomButton from '../components/CustomButton';
import { useTranslation } from "react-i18next";


export default function Login({}) {
    const { t } = useTranslation()
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const router = useRouter()
    const toast = useToast()

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
            const {access, refresh} = await login(username, password)
            toast.show(t('logged-in-successfully'), {type: 'success'})
            await userInLeague(access)
        } catch (error) {
            toast.show(JSON.stringify(error), {type: 'danger'})
        }
    }

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: process.env.ANDROID_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({
            scheme: 'com.matipendino2001.soccerpools',
        }),
    })

    const forgotPassword = () => {}
    useEffect(() => {
        googleAuth()
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
        <View style={styles.container}>
            <Image 
                source={require("../assets/img/pools-logo2.png")}
                style={styles.image}
            />
    
            <CustomInputSign
                inputMode='username'
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

            {/*<Pressable
                onPress={() => forgotPassword()}
            >
                <Text style={styles.forgotCreateText}>Forgot Your Password?</Text>
            </Pressable>*/}
            <Link href='/create-account' style={styles.forgotCreateText}>{t('create-account')}</Link>

            <Pressable
                onPress={() => promptAsync()}
            >
                <Image
                    source={require('../assets/img/google-icon.webp')}
                    style={styles.googleImg}
                />
            </Pressable>
        </View>   
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6860A1',
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
    }
})