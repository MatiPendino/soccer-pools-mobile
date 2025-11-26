import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Link, Router } from 'expo-router';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useRouter } from 'expo-router';
import { MAIN_COLOR } from '../../constants';
import CustomInputSign from '../../components/CustomInputSign';
import CustomButton from '../../components/CustomButton';
import { UserEditableProps } from '../../types';
import handleError from '../../utils/handleError';
import { useTranslation } from 'react-i18next';
import { Banner } from 'components/ads/Ads';
import ImageFormComponent from '../../components/ImageFormComponent';
import TopBar from '../../components/TopBar';
import { useUser, useUpdateUser, useDeleteUser } from '../../hooks/useUser';

export default function EditAccount({}) {
    const { t } = useTranslation();
    const toast: ToastType = useToast();
    const router: Router = useRouter();

    const { data: user, isLoading } = useUser();
    const { mutate: updateUserMutate, isPending: isUpdating } = useUpdateUser();
    const { mutate: deleteUserMutate, isPending: isDeleting } = useDeleteUser();

    const [userInfo, setUserInfo] = useState<UserEditableProps | null>(null);
    const [profileImage, setProfileImage] = useState<string>('');

    useEffect(() => {
        if (user) {
            setUserInfo({
                name: user.name,
                last_name: user.last_name,
                email: user.email,
                username: user.username,
                instagram_username: user.instagram_username || '',
                twitter_username: user.twitter_username || ''
            });
            setProfileImage(user.profile_image);
        }
    }, [user]);

    const editAccount = () => {
        if (!userInfo) return;
        updateUserMutate({ userData: userInfo, profileImage }, {
            onSuccess: () => {
                toast.show(t('user-updated-successfully'), { type: 'success' });
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        });
    }

    const removeAccount = () => {
        deleteUserMutate(undefined, {
            onSuccess: () => {
                toast.show(t('user-removed-successfully'), { type: 'success' });
                router.replace('/');
            },
            onError: (error) => {
                toast.show('There was an error removing the account, please try again later',
                    { type: 'danger' }
                );
            }
        });
    }

    //const isLoading = isUserLoading;

    return (
        <ScrollView style={styles.container}>
            <TopBar text={t('edit-your-account')} url='/home' />

            {!isLoading && userInfo &&
                <View style={styles.imageContainer}>
                    <ImageFormComponent image={profileImage} setImage={setProfileImage} />  
                </View>
            }

            {userInfo && (
                <>
                    <CustomInputSign
                        placeholder={t('username')}
                        value={isLoading ? '...' : userInfo.username}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, username: text }))}
                        isCapitalized={true}
                    />

                    <CustomInputSign
                        placeholder={t('first-name')}
                        value={isLoading ? '...' : userInfo.name}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, name: text }))}
                        isCapitalized={true}
                    />

                    <CustomInputSign
                        placeholder={t('last-name')}
                        value={isLoading ? '...' : userInfo.last_name}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, last_name: text }))}
                        isCapitalized={true}
                    />

                    <CustomInputSign
                        placeholder={t('email')}
                        value={isLoading ? '...' : userInfo.email}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
                        inputMode='email'
                    />

                    <CustomInputSign
                        placeholder={t('instagram-username-optional')}
                        value={isLoading ? '...' : userInfo.instagram_username}
                        setValue={
                            (text) => setUserInfo(prev => ({ ...prev, instagram_username: text }))
                        }
                    />

                    <CustomInputSign
                        placeholder={t('twitter-username-optional')}
                        value={isLoading ? '...' : userInfo.twitter_username}
                        setValue={
                            (text) => setUserInfo(prev => ({ ...prev, twitter_username: text }))
                        }
                    />
                </>
            )}

            {
                (isLoading || isUpdating)
                ?
                <ActivityIndicator size='large' color='#0000ff' />
                :
                <CustomButton 
                    callable={editAccount} 
                    btnText={t('update-account')} 
                    btnColor='#2F2766' 
                />
            }

            <Link href='update-password' style={styles.updatePasswordTxt}>
                {t('wanna-update-password')}
            </Link>

            {
                (isLoading || isDeleting)
                ?
                <ActivityIndicator size='large' color='#0000ff' />
                :
                <CustomButton 
                    callable={removeAccount} 
                    btnText={t('remove-account')} 
                    btnColor='#C52424' 
                />
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