import { useState } from "react"
import { View, StyleSheet, Text, ActivityIndicator } from "react-native"
import { Link } from "expo-router"
import { useToast } from "react-native-toast-notifications"
import CustomButton from "../../components/CustomButton"
import CustomInputSign from "../../components/CustomInputSign"
import { getToken } from "../../utils/storeToken"
import { editPassword } from "../../services/authService"
import { useTranslation } from "react-i18next"
import { Banner } from "../../components/Ads"

export default function UpdatePassword({}) {
    const { t } = useTranslation()
    const [oldPassword, setOldPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const toast = useToast()

    const updatePassword = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            await editPassword(token, oldPassword, newPassword)
            setOldPassword('')
            setNewPassword('')
            toast.show(t('password-updated-successfully'), {type: 'success'})
        } catch (error) {
            toast.show('There was an error updating password', {type: 'danger'})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.editTxt}>
                {t('update-your-password')}
            </Text>

            <CustomInputSign
                placeholder={t('current-password')}
                value={oldPassword}
                setValue={setOldPassword}
                isSecureTextEntry={true}
            />

            <CustomInputSign
                placeholder={t('new-password')}
                value={newPassword}
                setValue={setNewPassword}
                isSecureTextEntry={true}
            />

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={updatePassword} btnText={t('update-password')} btnColor='#2F2766' />
            }

            <Banner bannerId={process.env.UPDATE_PASSWORD_BANNER_ID} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%',
        width: '100%',
        flex: 1,
        marginHorizontal: 'auto',
        paddingTop: 50,
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 6
    },
    editTxt: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginHorizontal: 20,
        textAlign: 'center',
        marginBottom: 40
    }
})