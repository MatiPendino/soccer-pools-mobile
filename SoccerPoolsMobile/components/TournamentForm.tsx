import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Router, useRouter } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { MAIN_COLOR } from "../constants";
import AddPhotoButton from "./AddPhotoButton";
import { useTranslation } from "react-i18next";
import { Banner, interstitial } from "./Ads";
import { ActivityIndicator } from "react-native-paper";

interface TournamentFormProps {
    initialData?: any;
    onSubmit: CallableFunction;
    buttonLabel: string;
    isCreationMode: boolean;
    isLoading: boolean;
}

export default function TournamentForm({ 
    initialData, onSubmit, buttonLabel, isCreationMode, isLoading
}: TournamentFormProps) {
    const { t } = useTranslation()
    const [tournamentName, setTournamentName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [logo, setLogo] = useState<string>("");
    const router: Router = useRouter();

    const pickImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert(t('permission-media-required'));
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
            alert(t('no-image-selected'));
        }
    };

    const handleSubmit = () => {
        onSubmit({ name: tournamentName, description: description, logo: logo });
    };

    const setInitialFormData = () => {
        if (!isCreationMode) {
            if (initialData) {
                setTournamentName(initialData.name)
                setDescription(initialData.description)
                setLogo(initialData.logo)
            }
        }
    }

    interstitial(process.env.CREATE_TOURNAMENT_INTERST_ID)

    useEffect(() => {
        if (!isLoading) {
            setInitialFormData()
        }
    }, [isLoading])

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.tntNameTxt}>
                    {
                        initialData 
                        ? 
                        initialData.name.toString().toUpperCase() 
                        : 
                        t('create-tournament')
                    }
                </Text>
                <Pressable onPress={() => router.back()}>
                    <Entypo name="cross" color="white" size={30} />
                </Pressable>
            </View>

            <View style={styles.contentContainer}>
                <TextInput
                    style={styles.inputTxt}
                    placeholder={t('tournament-name')}
                    placeholderTextColor='white'
                    value={tournamentName}
                    onChangeText={setTournamentName}
                />

                <AddPhotoButton 
                    label={t('add-tournament-image')}
                    onPress={pickImage} 
                    logo={logo} 
                />

                <TextInput
                    style={[styles.inputTxt, styles.textArea]}
                    placeholder={t('add-tournament-description')}
                    placeholderTextColor='white'
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <TouchableOpacity 
                    onPress={() => !isLoading ? handleSubmit() : {}} 
                    style={styles.button}
                >
                    {
                        isLoading
                        ?
                        <ActivityIndicator color="#fff" size="small" />
                        :
                        <Text style={styles.buttonText}>
                            {buttonLabel}
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            
            <Banner bannerId={process.env.CREATE_TOURNAMENT_BANNER_ID} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1,
    },
    topBar: {
        backgroundColor: '#2F2766',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        marginTop: 20,
        paddingHorizontal: 5
    },
    contentContainer: {
        paddingHorizontal: 20
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
