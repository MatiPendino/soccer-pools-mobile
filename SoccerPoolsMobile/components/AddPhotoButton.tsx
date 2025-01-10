import { StyleSheet, View, Pressable, Text, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface AddPhotoButtonProps {
    label: string
    onPress: () => Promise<void>
    logo: string
}

export default function AddPhotoButton({ label, onPress, logo }: AddPhotoButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            {
                logo 
                ? 
                <Image source={{ uri: logo }} style={styles.imagePlaceholder} />
                : 
                <Image
                    source={require('../assets/img/add-image.jpg')}
                    style={styles.imagePlaceholder}
                />
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        width: 250,
        height: 250,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 'auto'
    },
    imagePlaceholder: {
        width: 250,
        height: 250,
        objectFit: 'cover',
        alignSelf: "center",
        borderRadius: 10,
    },
});
