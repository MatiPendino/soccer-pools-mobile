import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Pressable, Image } from "react-native";
import { Router, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import AddPhotoButton from "./AddPhotoButton";

interface TournamentFormProps {
    initialData?: any;
    onSubmit: CallableFunction;
    buttonLabel: string;
    isCreationMode: boolean;
}

export default function TournamentForm({ initialData, onSubmit, buttonLabel, isCreationMode }: TournamentFormProps) {
    const [tournamentName, setTournamentName] = useState<string>(!isCreationMode ? initialData.name : "");
    const [description, setDescription] = useState<string>(!isCreationMode ? initialData.description : "");
    const [logo, setLogo] = useState<string>(!isCreationMode ? initialData.logo : "");
    const router: Router = useRouter();

    const pickImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setLogo(result.assets[0].uri);
        } else {
            alert('No image selected!');
        }
    };

    const handleSubmit = () => {
        onSubmit({ name: tournamentName, description: description, logo: logo });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.tntNameTxt}>
                    {
                        initialData 
                        ? 
                        initialData.name.toString().toUpperCase() 
                        : 
                        'CREATE TOURNAMENT'
                    }
                </Text>
                <Pressable onPress={() => router.back()}>
                    <Entypo name="cross" color="white" size={30} />
                </Pressable>
            </View>

            <TextInput
                style={styles.inputTxt}
                placeholder="Tournament Name..."
                placeholderTextColor='white'
                value={tournamentName}
                onChangeText={setTournamentName}
            />

            <AddPhotoButton 
                label="Add Tournament Image" 
                onPress={pickImage} 
                logo={logo} 
            />

            <TextInput
                style={[styles.inputTxt, styles.textArea]}
                placeholder="Add a description for your tournament (optional)..."
                placeholderTextColor='white'
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>{buttonLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        flex: 1,
        paddingHorizontal: 20
    },
    topBar: {
        backgroundColor: '#6860A1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 5
    },
    tntNameTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginStart: 5
    },
    inputTxt: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
        color: 'white',
        borderColor: '#AFB1B6',
    },
    textArea: {
        height: 100
    },
    button: {
        backgroundColor: "#2F2766",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 17,
    }
});
