import { StyleSheet, Pressable, Text } from "react-native"

export default function CustomButton({callable, btnText, btnColor}) {

    return (
        <Pressable
            style={[styles.button, {backgroundColor: btnColor}]}
            onPress={() => callable()}
        >
            <Text style={styles.buttonText}>{btnText}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#2F2766',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 20,
        width: 250,
        marginHorizontal: 'auto'
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 15,
        textAlign: 'center'
    },
})