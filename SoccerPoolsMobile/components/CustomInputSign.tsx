import { View, TextInput, Pressable, StyleSheet } from "react-native"
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react"

interface Props {
    inputMode?: 'text' | 'email'
    placeholder: string
    isSecureTextEntry?: boolean
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
    isActive?: boolean
    isCapitalized?: boolean
}

export default function CustomInputSign({
    inputMode='text', placeholder, isSecureTextEntry=false, value, setValue, isActive=true,
    isCapitalized=false
}: Props) {
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, {color: isActive ? '#fff' : '#ddd'}]}
                placeholder={placeholder}
                placeholderTextColor='#ddd'
                value={value}
                autoCapitalize={isCapitalized ? 'words' : 'none'}
                onChangeText={setValue}
                secureTextEntry={isPasswordHidden && isSecureTextEntry}
                inputMode={inputMode}
                editable={isActive}
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
        fontSize: 15,
        borderColor: '#AFB1B6',
        borderWidth: 1,
        borderRadius: 7,
        paddingStart: 10,
        paddingVertical: 8,
        marginBottom: 20,
        width: 350,
        marginHorizontal: 'auto'
    },
    eyeIcon: {
        position: 'absolute',
        top: 12,
        right: 35
    },
})