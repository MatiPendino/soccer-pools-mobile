import { StyleSheet, Pressable, Text } from "react-native"

export default function CustomButton({callable, btnText}) {

    return (
        <Pressable
            style={styles.button}
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
        marginBottom: 20
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 15
    },
})