import React, { useState } from 'react'
import { ToastType, useToast } from 'react-native-toast-notifications'
import { View, Image, StyleSheet, Text, TouchableOpacity, Platform, ScrollView } from 'react-native'
import { Link, Router, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../../constants';
import { login } from 'services/authService';
import { getUserInLeague } from 'services/authService';
import CustomInputSign from 'components/CustomInputSign';
import CustomButton from 'components/CustomButton';
import handleError from 'utils/handleError';
import ForgotPasswordModal from '../../modals/ForgotPasswordModal'
import { Entypo } from '@expo/vector-icons';
import GoogleAuthButton from 'components/GoogleAuthButton';

// This is crucial for web OAuth to work properly
if (Platform.OS === 'web') {
    WebBrowser.maybeCompleteAuthSession();
}

export default function Login({}) {
    const { t } = useTranslation();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const router: Router = useRouter();
    const toast: ToastType = useToast();

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

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
        >
            <Link href='/' style={{width: Platform.OS === 'web' ? '40%' : '80%', marginTop: 25}}>
                <Entypo name='chevron-left' color='white' size={30} />   
            </Link>

            <Image 
                source={require('../../assets/icon-no-bg.png')}
                style={styles.image}
            />
    
            <View style={styles.inputContainer}>
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
            </View>
            
            
            <CustomButton callable={logIn} btnText={t('log-in')} btnColor='#2F2766' />

            <ForgotPasswordModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            <View style={styles.forgotCreateContainer}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.forgotCreateText}>{t('forgot-password')}</Text>
                </TouchableOpacity>

                <Link href='/create-account' style={styles.forgotCreateText}>{t('create-account')}</Link>
            </View>

            <GoogleAuthButton />
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 240,
        height: 240
    },
    inputContainer: {
        width: Platform.OS === 'web' ? '60%' : '95%',
    },
    forgotCreateContainer: { 
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        width: Platform.OS === 'web' ? '40%' : '50%',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'space-around'
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
        marginVertical: 10
    },
    googleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
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