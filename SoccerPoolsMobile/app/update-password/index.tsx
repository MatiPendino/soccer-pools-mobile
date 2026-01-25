import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import { Banner } from 'components/ads/Ads';
import { useBreakpoint } from 'hooks/useBreakpoint';
import { ThemedInput, ThemedButton, ThemedLoader } from '../../components/ui';
import { colors, spacing, typography } from '../../theme';
import { getToken } from '../../utils/storeToken';
import handleError from '../../utils/handleError';
import { editPassword } from '../../services/authService';

export default function UpdatePassword({}) {
    const { t } = useTranslation();
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { isLG } = useBreakpoint();
    const toast: ToastType = useToast();

    const updatePassword = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            await editPassword(token, oldPassword.trim(), newPassword.trim());
            setOldPassword('');
            setNewPassword('');
            toast.show(t('password-updated-successfully'), {type: 'success'});
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.editTxt}>
                {t('update-your-password')}
            </Text>

            <View style={{width: isLG ? '60%' : '85%', marginHorizontal: 'auto' }}>
                <ThemedInput
                    placeholder={t('current-password')}
                    label={t('current-password')}
                    value={oldPassword}
                    setValue={setOldPassword}
                    isSecureTextEntry={true}
                />

                <ThemedInput
                    placeholder={t('new-password')}
                    label={t('new-password')}
                    value={newPassword}
                    setValue={setNewPassword}
                    isSecureTextEntry={true}
                />    
            </View>
            
            {
                isLoading
                ?
                <ThemedLoader />
                :
                <View style={{ width: isLG ? '60%' : '85%', marginHorizontal: 'auto' }}>
                    <ThemedButton 
                        onPress={updatePassword} 
                        label={t('update-password')} 
                        variant="secondary" 
                    />    
                </View>
            }

            <Banner bannerId={process.env.UPDATE_PASSWORD_BANNER_ID} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primaryDarker,
        height: '100%',
        width: '100%',
        flex: 1,
        marginHorizontal: 'auto',
        paddingTop: spacing.xxxl,
        paddingHorizontal: spacing.sm,
        paddingVertical: 0,
        borderRadius: 6
    },
    editTxt: {
        color: colors.white,
        fontSize: typography.fontSize.displaySmall,
        fontWeight: typography.fontWeight.bold,
        marginHorizontal: spacing.xl,
        textAlign: 'center',
        marginBottom: spacing.xxxl
    }
});