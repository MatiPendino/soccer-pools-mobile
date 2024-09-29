import { useState } from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import { login } from '../services/authService'
import styles from './styles';
import CustomInputSign from '../components/CustomInputSign';
import CustomButton from '../components/CustomButton';

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()

  const logIn = async () => {
    try {
      const {access, refresh} = await login(email, password)
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
            inputMode='email'
            value={email}
            setValue={setEmail}
            placeholder='E-mail'
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
  );
}
