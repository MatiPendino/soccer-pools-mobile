import { Pressable, ScrollView, Text, Image, ActivityIndicator, View } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { register, login, googleOauth2SignIn, getUserInLeague } from "../../services/authService";
import styles from "./styles";
import { Email } from "../../types";

export default function CreateAccount({}) {
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

    const logIn = async (): Promise<void> => {
        try {
            const {access, refresh} = await login(username, password)
            if (access && refresh) {
                router.replace('select-league')
            }
        } catch (error) {
            toast.show(JSON.stringify(error), {type: 'danger'})
        }
    }

    const createAccount = async (): Promise<void> => {
        setIsLoading(true)
        try {
            const registerStatus = await register(firstName, lastName, username, email, password)
            if (registerStatus === 201) {
                toast.show('Account created successfully!', {type: 'success'})
                await logIn()
            }
        } catch (error) {
            toast.show(JSON.stringify(error), {type: 'danger'})
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

    return (
        <View style={styles.viewContainer}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.createTxt}>
                    Create Your SoccerPools Account
                </Text>

                <Pressable 
                    onPress={() => promptAsync()}
                    style={styles.googleBtn}
                >
                    <View style={styles.googleContainer}>
                        <Text style={styles.googleTxt}>SIGN UP WITH</Text>
                        <Image
                            source={require('../../assets/img/google-icon.webp')}
                            style={styles.googleImg}
                        />
                    </View>
                </Pressable>

                <View style={styles.separationContainer}>
                    <View style={styles.whiteLine}></View>
                    <Text style={styles.orTxt}>Or</Text>
                    <View style={styles.whiteLine}></View>
                </View>

                <CustomInputSign
                    placeholder='First Name'
                    value={firstName}
                    setValue={setFirstName}
                />

                <CustomInputSign
                    placeholder='Last Name'
                    value={lastName}
                    setValue={setLastName}
                />

                <CustomInputSign
                    placeholder='Username'
                    value={username}
                    setValue={setUsername}
                />

                <CustomInputSign
                    placeholder='E-mail'
                    value={email}
                    setValue={setEmail}
                />

                <CustomInputSign
                    placeholder='Password'
                    value={password}
                    setValue={setPassword}
                    isSecureTextEntry={true}
                />

                {
                    isLoading
                    ?
                    <ActivityIndicator size="large" color="#0000ff" />
                    :
                    <CustomButton callable={createAccount} btnText='CREATE ACCOUNT' btnColor='#2F2766' />
                }

                <Link href='/' style={styles.alreadyTxt}>Already Have An Account? Login Here</Link>
            </ScrollView>    
        </View>
    )
}