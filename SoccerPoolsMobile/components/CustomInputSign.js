import { View, TextInput, Pressable, StyleSheet } from "react-native"
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react"

export default function CustomInputSign(
    {inputMode='text', placeholder, isSecureTextEntry=false, value, setValue}
) {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor='#ddd'
                value={value}
                onChangeText={setValue}
                secureTextEntry={isPasswordHidden && isSecureTextEntry}
                inputMode={inputMode}
            />
            {isSecureTextEntry &&
                <Pressable
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                style={styles.eyeIcon}
                >
                    <FontAwesome
                        size={18}
                        name={isPasswordHidden ? 'eye' : 'eye-slash'}
                        color='#ddd'
                    />  
                </Pressable>
            }
        </View>   
    )
   
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        position: 'relative'
    },
    input: {
        color: '#fff',
        fontSize: 15,
        borderColor: '#AFB1B6',
        borderWidth: 1,
        borderRadius: 7,
        paddingStart: 10,
        paddingVertical: 8,
        marginBottom: 20,
        width: 350
    },
    eyeIcon: {
        position: 'absolute',
        top: 13,
        right: 13
    },
})