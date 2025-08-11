import { ScrollView, Text, ActivityIndicator, View, Platform, Alert } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import handleError from "../../utils/handleError";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { register } from "../../services/authService";
import styles from "./styles";
import { Email } from "../../types";
import { useTranslation } from "react-i18next";
import { removeToken } from 'services/api';
import { getToken } from 'utils/storeToken';
import { Entypo } from "@expo/vector-icons";
import GoogleAuthButton from "components/GoogleAuthButton";
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { getUserLeagueRoute } from "utils/getUserLeagueRoute";

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
    const toast = useToast()
    const router = useRouter()
    const { isLG } = useBreakpoint();

    useEffect(() => {
        const checkUserLeagueStatus = async (token): Promise<void> => {
            try {
               router.replace(await getUserLeagueRoute(token));
            } catch (error) {
                Alert.alert('Error', handleError(error), [{ text: 'OK', onPress: () => {}}], {cancelable: false});
                await removeToken()
            }
        }
    
        const checkAuth = async (): Promise<void> => {
            const token = await getToken();
            if (!!token) {
                checkUserLeagueStatus(token)
            }
        }
        
        checkAuth();
    }, []);

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

    return (
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
        >
            <Link href='/' style={{width: isLG ? '50%' : '90%'}}>
                <Entypo name="chevron-left" color="white" size={30} />   
            </Link>
                
            <Text style={styles.createTxt}>
                {t('create-your-account')}
            </Text>

            <GoogleAuthButton isLogIn={false} />

            <View style={styles.separationContainer}>
                <View style={styles.whiteLine}></View>
                <Text style={styles.orTxt}>{t('or')}</Text>
                <View style={styles.whiteLine}></View>
            </View>

            <View style={{width: '75%'}}>
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
            </View>
            

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={createAccount} btnText={t('create-account')} btnColor='#2F2766' />
            }

            <Link href='/login' style={styles.alreadyTxt}>{t('already-account')}</Link>
        </ScrollView>    
    )
}