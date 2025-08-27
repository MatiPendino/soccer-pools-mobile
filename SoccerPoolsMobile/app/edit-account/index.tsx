import { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Link } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import { MAIN_COLOR } from "../../constants";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { UserEditableProps } from '../../types';
import { getToken } from "../../utils/storeToken";
import handleError from "../../utils/handleError";
import { deleteUser, getUser, updateUser } from "../../services/authService";
import { removeToken } from "../../services/api";
import { useTranslation } from "react-i18next";
import { Banner, interstitial } from "components/ads/Ads";
import ImageFormComponent from '../../components/ImageFormComponent';
import TopBar from '../../components/TopBar';

export default function EditAccount({}) {
    const { t } = useTranslation()
    const [userInfo, setUserInfo] = useState<UserEditableProps>(null);
    const [profileImage, setProfileImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()
    const router = useRouter()

    const editAccount = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            await updateUser(token, userInfo, profileImage);
            toast.show(t('user-updated-successfully'), {type: 'success'})
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }

    const removeAccount = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            if (token) {
                await deleteUser(token)
                await removeToken()
                toast.show(t('user-removed-successfully'), {type: 'success'})
                router.replace('/')
            }
        } catch (error) {
            toast.show('There was an error removing the account, please try again later', {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const retrieveUserDetails = async () => {
            try {
                const token = await getToken()
                const userData = await getUser(token)

                setUserInfo({
                    name: userData.name, 
                    last_name: userData.last_name, 
                    email: userData.email, 
                    username: userData.username, 
                    instagram_username: userData.instagram_username || '',
                    twitter_username: userData.twitter_username || ''
                })
                setProfileImage(userData.profile_image)
            } catch (error) {
                toast.show('There was an error retrieving the user', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }

        retrieveUserDetails()
    }, [])

    //interstitial(process.env.UPDATE_ACCOUNT_INTERST_ID)

    return (
        <ScrollView style={styles.container}>
            <TopBar text={t('edit-your-account')} url='/home' />

            {!isLoading &&
                <View style={styles.imageContainer}>
                    <ImageFormComponent image={profileImage} setImage={setProfileImage} />  
                </View>
            }

            <CustomInputSign
                placeholder={t('username')}
                value={isLoading ? '...' : userInfo.username}
                setValue={(text) => setUserInfo(prev => ({...prev, username: text}))}
                isCapitalized={true}
            />

            <CustomInputSign
                placeholder={t('first-name')}
                value={isLoading ? '...' : userInfo.name}
                setValue={(text) => setUserInfo(prev => ({...prev, name: text}))}
                isCapitalized={true}
            />

            <CustomInputSign
                placeholder={t('last-name')}
                value={isLoading ? '...' : userInfo.last_name}
                setValue={(text) => setUserInfo(prev => ({...prev, last_name: text}))}
                isCapitalized={true}
            />

            <CustomInputSign
                placeholder={t('email')}
                value={isLoading ? '...' : userInfo.email}
                setValue={(text) => setUserInfo(prev => ({...prev, email: text}))}
                inputMode="email"
            />

            <CustomInputSign
                placeholder={t('instagram-username-optional')}
                value={isLoading ? '...' : userInfo.instagram_username}
                setValue={(text) => setUserInfo(prev => ({...prev, instagram_username: text}))}
            />

            <CustomInputSign
                placeholder={t('twitter-username-optional')}
                value={isLoading ? '...' : userInfo.twitter_username}
                setValue={(text) => setUserInfo(prev => ({...prev, twitter_username: text}))}
            />

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={editAccount} btnText={t('update-account')} btnColor='#2F2766' />
            }

            <Link href='update-password' style={styles.updatePasswordTxt}>{t('wanna-update-password')}</Link>

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={removeAccount} btnText={t('remove-account')} btnColor='#C52424' />
            }

            <Banner bannerId={process.env.UPDATE_ACCOUNT_BANNER_ID} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        height: '100%',
        width: '100%',
        flex: 1,
        marginHorizontal: 'auto',
        paddingVertical: 0,
    },
    editTxt: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginHorizontal: 50,
        textAlign: 'center',
        marginBottom: 40
    },
    updatePasswordTxt: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 70
    },
    imageContainer: {
        marginHorizontal: 'auto',
        marginTop: 15
    },
});