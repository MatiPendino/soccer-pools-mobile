import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Link, Router } from 'expo-router';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useRouter } from 'expo-router';
import { Banner } from 'components/ads/Ads';
import { useBreakpoint } from 'hooks/useBreakpoint';
import { ThemedInput, ThemedButton, ThemedLoader } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import { UserEditableProps } from '../../types';
import handleError from '../../utils/handleError';
import ImageFormComponent from '../../components/ImageFormComponent';
import TopBar from '../../components/TopBar';
import { useUser, useUpdateUser, useDeleteUser } from '../../hooks/useUser';

export default function EditAccount({}) {
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
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

    return (
        <ScrollView style={styles.container}>
            <TopBar text={t('edit-your-account')} url='/home' />

            {!isLoading && userInfo &&
                <View style={styles.imageContainer}>
                    <ImageFormComponent image={profileImage} setImage={setProfileImage} />  
                </View>
            }

            {userInfo && (
                <View style={{width: isLG ? '60%' : '85%', marginHorizontal: 'auto' }}>
                    <ThemedInput
                        placeholder={t('username')}
                        label={t('username')}
                        value={isLoading ? '...' : userInfo.username}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, username: text }))}
                        isCapitalized={true}
                    />

                    <ThemedInput
                        placeholder={t('first-name')}
                        label={t('first-name')}
                        value={isLoading ? '...' : userInfo.name}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, name: text }))}
                        isCapitalized={true}
                    />

                    <ThemedInput
                        placeholder={t('last-name')}
                        label={t('last-name')}
                        value={isLoading ? '...' : userInfo.last_name}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, last_name: text }))}
                        isCapitalized={true}
                    />

                    <ThemedInput
                        placeholder={t('email')}
                        label={t('email')}
                        value={isLoading ? '...' : userInfo.email}
                        setValue={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
                        inputMode='email'
                    />

                    <ThemedInput
                        placeholder={t('instagram-username-optional')}
                        label={t('instagram-username-optional')}
                        value={isLoading ? '...' : userInfo.instagram_username}
                        setValue={
                            (text) => setUserInfo(prev => ({ ...prev, instagram_username: text }))
                        }
                    />

                    <ThemedInput
                        placeholder={t('twitter-username-optional')}
                        label={t('twitter-username-optional')}
                        value={isLoading ? '...' : userInfo.twitter_username}
                        setValue={
                            (text) => setUserInfo(prev => ({ ...prev, twitter_username: text }))
                        }
                    />
                </View>
            )}

            {
                (isLoading || isUpdating)
                ?
                <ThemedLoader />
                :
                <View style={{ width: isLG ? '60%' : '85%', marginHorizontal: 'auto' }}>
                    <ThemedButton
                        onPress={editAccount}
                        label={t('update-account')}
                        variant="secondary"
                    />    
                </View>
            }

            <Link href='update-password' style={styles.updatePasswordTxt}>
                {t('wanna-update-password')}
            </Link>

            {
                (isLoading || isDeleting)
                ?
                <ThemedLoader />
                :
                <View style={{width: isLG ? '60%' : '85%', marginHorizontal: 'auto' }}>
                    <ThemedButton
                        onPress={removeAccount}
                        label={t('remove-account')}
                        variant="danger"
                    />
                </View>
            }

            <Banner bannerId={process.env.UPDATE_ACCOUNT_BANNER_ID} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primaryDarker,
        height: '100%',
        width: '100%',
        flex: 1,
        marginHorizontal: 'auto',
        paddingVertical: 0,
    },
    editTxt: {
        color: colors.white,
        fontSize: typography.fontSize.displaySmall,
        fontWeight: typography.fontWeight.bold,
        marginHorizontal: spacing.xxxl,
        textAlign: 'center',
        marginBottom: spacing.xxxl
    },
    updatePasswordTxt: {
        color: colors.white,
        fontSize: typography.fontSize.bodyLarge,
        fontWeight: typography.fontWeight.medium,
        textAlign: 'center',
        marginBottom: 70,
    },
    imageContainer: {
        marginHorizontal: 'auto',
        marginTop: spacing.lg
    },
});