import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { Email } from "../../types";
import { getToken } from "../../utils/storeToken";
import { deleteUser, getUser, updateUser } from "../../services/authService";
import { removeToken } from "../../services/api";

export default function EditAccount({}) {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<Email>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()
    const router = useRouter()

    const editAccount = async () => {
        setIsLoading(true)
        try {
            const token = await getToken()
            if (token) {
                const {name, last_name} = await updateUser(token, firstName, lastName)
                if (name && last_name) {
                    toast.show('User updated successfully!', {type: 'success'})
                } else {
                    toast.show('There was an error updating the user', {type: 'danger'})
                }
            }
        } catch (error) {
            toast.show('There was an error updating the user', {type: 'danger'})
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
                toast.show('The account was removed successfully!', {type: 'success'})
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
                if (token) {
                    const userData = await getUser(token)
                    setEmail(userData.email)
                    setFirstName(userData.name)
                    setLastName(userData.last_name)
                } 
            } catch (error) {
                toast.show('There was an error retrieving the user', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }

        retrieveUserDetails()
    }, [])

    if (isLoading) {<ActivityIndicator size="large" color="#0000ff" />}
    return (
        <View style={styles.container}>
            <Text style={styles.editTxt}>
                Edit Your Account
            </Text>

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
                placeholder='E-mail'
                value={email}
                setValue={setEmail}
                isActive={false}
            />

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={editAccount} btnText='UPDATE ACCOUNT' btnColor='#2F2766' />
            }

            <Link href='update-password' style={styles.updatePasswordTxt}>Wanna update password? Click here</Link>

            {
                isLoading
                ?
                <ActivityIndicator size="large" color="#0000ff" />
                :
                <CustomButton callable={removeAccount} btnText='REMOVE ACCOUNT' btnColor='#C52424' />
            }
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
    }
})