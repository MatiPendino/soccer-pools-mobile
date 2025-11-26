import React, { useState, useEffect } from 'react';
import { ToastType, useToast } from 'react-native-toast-notifications';
import {
    View, Image, StyleSheet, Text, TouchableOpacity, Platform, ScrollView, 
    Alert, ActivityIndicator
} from 'react-native';
import { Link, Router, useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useTranslation } from 'react-i18next';
import CustomInputSign from 'components/CustomInputSign';
import CustomButton from 'components/CustomButton';
import TopBar from 'components/TopBar';
import Footer from 'components/footer/Footer';
import GoogleAuthButton from 'components/GoogleAuthButton';
import { removeToken } from 'services/api';
import handleError from 'utils/handleError';
import { getToken } from 'utils/storeToken';
import { getUserLeagueRoute } from 'utils/getUserLeagueRoute';
import ForgotPasswordModal from '../../modals/ForgotPasswordModal';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useLogin, useUser } from '../../hooks/useUser';
import { MAIN_COLOR } from '../../constants';

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
    const { isLG } = useBreakpoint();
    const { referralCode } = useLocalSearchParams();

    const { mutate: loginUser, isPending: isLoggingIn } = useLogin();

    useEffect(() => {
        const checkUserLeagueStatus = async (token): Promise<void> => {
            try {
               router.replace(await getUserLeagueRoute(token));
            } catch (error) {
                Alert.alert(
                    'Error', 
                    handleError(error), 
                    [{ text: 'OK', onPress: () => {}}], {cancelable: false}
                );
                await removeToken();
            }
        };
    
        const checkAuth = async (): Promise<void> => {
            const token = await getToken();
            if (!!token) {
                checkUserLeagueStatus(token);
            }
        }
        
        checkAuth();
    }, []);

    const logIn = () => {
        loginUser({ username: username.trim(), password: password.trim() }, {
            onSuccess: async (data) => {
                toast.show(t('logged-in-successfully'), { type: 'success' });
                router.replace(await getUserLeagueRoute(data.access));
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        });
    };

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
        >
            <TopBar 
                url={`/?referralCode=${referralCode ? referralCode : ''}`} 
                text={t('log-in')} 
            />

            <Image 
                source={require('../../assets/icon-no-bg.png')}
                style={styles.image}
            />
    
            <View style={{width: isLG ? '60%' : '95%'}}>
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

            {
                isLoggingIn
                    ?
                    <ActivityIndicator size='large' color='#0000ff' />
                    :
                    <CustomButton callable={logIn} btnText={t('log-in')} btnColor='#2F2766' />
            }

            <ForgotPasswordModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />

            <View 
                style={[styles.forgotCreateContainer, {
                    flexDirection: isLG ? 'row' : 'column',
                    width: isLG ? '40%' : '50%'
                }]}
            >
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.forgotCreateText}>{t('forgot-password')}</Text>
                </TouchableOpacity>

                <Link 
                    href={`/create-account?referralCode=${referralCode ? referralCode : ''}`} 
                    style={styles.forgotCreateText}
                >
                    {t('create-account')}
                </Link>
            </View>

            <GoogleAuthButton 
                callingRoute='login' 
                referralCode={
                    referralCode 
                    ? 
                    (Array.isArray(referralCode) ? referralCode[0] : referralCode) 
                    : 
                    ''
                }
            />

            
            {Platform.OS === 'web' && 
                <View style={{marginTop: 50, width: '100%'}}>
                    <Footer />
                </View>
            }    
        </ScrollView>   
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 240,
        height: 240
    },
    forgotCreateContainer: { 
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