import { Pressable, ScrollView, Text, Image, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import CustomInputSign from "../../components/CustomInputSign";
import CustomButton from "../../components/CustomButton";
import { register } from "../../services/authService";

export default function CreateAccount({}) {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const toast = useToast()

    const createAccount = async () => {
        try {
            const data = await register(firstName, lastName, username, email, password)
            toast.show('Logged in successfully!', {type: 'success'})
        } catch (error) {
            toast.show(JSON.stringify(error), {type: 'danger'})
        }
    }

    const googleLogIn = () => {

    }

    return (
        <View style={styles.viewContainer}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.createTxt}>
                    Create Your SoccerPools Account
                </Text>

                <Pressable 
                    onPress={() => googleLogIn()}
                    style={styles.googleBtn}
                >
                    <View style={styles.googleContainer}>
                        <Text style={styles.googleTxt}>SIGN UP WITH</Text>
                        <Image
                            source={require('../../assets/img/google-icon.webp')}
                            style={styles.googleImg}
                        />
                    </View>
                </Pressable>

                <View style={styles.separationContainer}>
                    <View style={styles.whiteLine}></View>
                    <Text style={styles.orTxt}>Or</Text>
                    <View style={styles.whiteLine}></View>
                </View>

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
                    placeholder='Username'
                    value={username}
                    setValue={setUsername}
                />

                <CustomInputSign
                    placeholder='E-mail'
                    value={email}
                    setValue={setEmail}
                />

                <CustomInputSign
                    placeholder='Password'
                    value={password}
                    setValue={setPassword}
                    isSecureTextEntry={true}
                />

                <CustomButton callable={createAccount} btnText='CREATE ACCOUNT' />

                <Link href='/' style={styles.alreadyTxt}>Already Have An Account? Login Here</Link>
            </ScrollView>    
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#6860A1',
        height: '100%'
    },
    container: {
        width: '100%',
        flex: 1,
        marginHorizontal: 'auto',
        marginTop: 50,
        marginBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderRadius: 6
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    },
    createTxt: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginHorizontal: 50,
        textAlign: 'center'
    },
    googleBtn: {
        backgroundColor: '#AA962C',
        borderRadius: 10,
        width: 270,
        marginVertical: 20
    },
    googleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5
    },
    googleTxt: {
        color: '#fff',
        fontWeight: 'bold',
        marginEnd: 8,
        fontSize: 17
    },
    googleImg: {
        width: 42,
        height: 42
    },
    separationContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    whiteLine: {
        width: '40%',
        height: 1,
        marginVertical: 'auto',
        backgroundColor: '#c2c2c2'
    },
    orTxt: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginHorizontal: 10,
        marginBottom: 20
    },
    alreadyTxt: {
        color: '#fff',
        fontSize: 14,
        fontStyle: 'italic'
    }
})