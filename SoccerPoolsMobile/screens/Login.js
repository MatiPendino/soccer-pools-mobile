import { useState } from "react"
import { useToast } from "react-native-toast-notifications"
import { Text, View, Image, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { login } from '../services/authService'
import CustomInputSign from '../components/CustomInputSign';
import CustomButton from '../components/CustomButton';


export default function Login({}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const toast = useToast()

    const logIn = async () => {
        try {
            const {access, refresh} = await login(username, password)
            toast.show('Logged in successfully!', {type: 'success'})
        } catch (error) {
            toast.show(JSON.stringify(error), {type: 'danger'})
        }
    }

    const forgotPassword = () => {}
    const createAccount = () => {}
    const googleLogIn = () => {}

    return (
        <View style={styles.container}>
            <Image 
                source={require("../assets/img/pools-logo2.png")}
                style={styles.image}
            />
    
            <CustomInputSign
                inputMode='username'
                value={username}
                setValue={setUsername}
                placeholder='Username'
            />

            <CustomInputSign
                value={password}
                setValue={setPassword}
                placeholder='Password'
                isSecureTextEntry={true}
            />
            
            <CustomButton callable={logIn} btnText='LOG IN' />

            <Pressable
                style={styles.forgotBtn}
                onPress={() => forgotPassword()}
            >
                <Text style={styles.forgotCreateText}>Forgot Your Password?</Text>
            </Pressable>
            <Link href='/create-account' style={styles.forgotCreateText}>Create Account</Link>

            <Pressable
                onPress={() => googleLogIn()}
            >
                <Image
                    source={require('../assets/img/google-icon.webp')}
                    style={styles.googleImg}
                />
            </Pressable>
        </View>   
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#6860A1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 320,
        height: 320
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
        marginTop: 30
    }
});