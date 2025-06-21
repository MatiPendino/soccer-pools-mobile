import { useEffect, useState } from "react"
import * as ImagePicker from "expo-image-picker"
import { 
    View, TextInput, Text, TouchableOpacity, StyleSheet, Pressable, KeyboardAvoidingView,
    Platform, ScrollView, Image
} from "react-native"
import { type Router, useRouter } from "expo-router"
import { Entypo, MaterialIcons, Feather } from "@expo/vector-icons"
import { MAIN_COLOR } from "../constants"
import { useTranslation } from "react-i18next"
import { Banner, interstitial } from "components/ads/Ads"
import { ActivityIndicator } from "react-native-paper"

interface TournamentFormProps {
    initialData?: any
    onSubmit: CallableFunction
    buttonLabel: string
    isCreationMode: boolean
    isLoading: boolean
}

export default function TournamentForm({
    initialData, onSubmit, buttonLabel, isCreationMode, isLoading,
}: TournamentFormProps) {
    const { t } = useTranslation()
    const [tournamentName, setTournamentName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [logo, setLogo] = useState<string>("")
    const router: Router = useRouter()

    const pickImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
            alert(t("permission-media-required"))
            return
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })

        if (!result.canceled) {
            setLogo(result.assets[0].uri)
        } else {
            alert(t("no-image-selected"))
        }
    }

    const handleSubmit = () => {
        onSubmit({ name: tournamentName, description: description, logo: logo })
    }

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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.tntNameTxt}>
                    {initialData ? initialData.name.toString().toUpperCase() : t("create-tournament")}
                </Text>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <Entypo name="cross" color="white" size={24} />
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t("tournament-name")}</Text>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="emoji-events" size={20} color="#8F92A1" style={styles.inputIcon} />
                        <TextInput
                            style={styles.inputTxt}
                            placeholder={t("tournament-name")}
                            placeholderTextColor="#8F92A1"
                            value={tournamentName}
                            onChangeText={setTournamentName}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t("add-tournament-image")}</Text>
                    {
                        logo 
                        ? 
                        <View style={styles.logoContainer}>
                            <Image source={{ uri: logo }} style={styles.logoPreview} />
                            <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
                                <Feather name="edit-2" size={16} color="white" />
                            </TouchableOpacity>
                        </View>
                        : 
                        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                            <Feather name="image" size={24} color="white" />
                            <Text style={styles.imagePickerText}>{t("add-tournament-image")}</Text>
                        </TouchableOpacity>
                    }
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>{t("description")}</Text>

                    <View style={[styles.inputContainer, styles.textAreaContainer]}>
                        <TextInput
                            style={[styles.inputTxt, styles.textArea]}
                            placeholder={t("add-tournament-description")}
                            placeholderTextColor="#8F92A1"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => (!isLoading ? handleSubmit() : {})}
                    style={[styles.button, (tournamentName.trim() === "" || isLoading) && styles.buttonDisabled]}
                    disabled={tournamentName.trim() === "" || isLoading}
                >
                    {
                        isLoading 
                        ? 
                        <ActivityIndicator color="#fff" size="small" />
                        : 
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10}}>
                            <Text style={styles.buttonText}>{buttonLabel}</Text>
                            <Feather name="arrow-right" size={20} color="white" style={styles.buttonIcon} />
                        </View>
                    }
                </TouchableOpacity>
            </ScrollView>

            <Banner bannerId={process.env.CREATE_TOURNAMENT_BANNER_ID} />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1,
    },
    scrollView: {
        flex: 1,
        width: Platform.OS === 'web' ? '70%' : '97%',
        marginHorizontal: 'auto',
    },
    topBar: {
        backgroundColor: "#2F2766",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 40,
    },
    tntNameTxt: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        opacity: 0.9,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        overflow: "hidden",
    },
    inputIcon: {
        marginLeft: 16,
    },
    inputTxt: {
        flex: 1,
        padding: 16,
        color: "white",
        fontSize: 16,
    },
    textAreaContainer: {
        height: 120,
        alignItems: "flex-start",
    },
    textArea: {
        height: "100%",
    },
    imagePickerButton: {
        height: 120,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderStyle: "dashed",
        justifyContent: "center",
        alignItems: "center",
    },
    imagePickerText: {
        color: "white",
        marginTop: 8,
        opacity: 0.8,
    },
    logoContainer: {
        position: "relative",
        height: Platform.OS === 'web' ? 400 : 220,
        width: Platform.OS === 'web' ? 400 : 220,
        borderRadius: 12,
        //overflow: "hidden",
    },
    logoPreview: {
        objectFit: 'cover',
        height: "100%",
        borderRadius: 12,
    },
    changeImageButton: {
        position: "absolute",
        bottom: 12,
        right: 12,
        backgroundColor: "rgba(47, 39, 102, 0.8)",
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        backgroundColor: "#2F2766",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonDisabled: {
        backgroundColor: "rgba(47, 39, 102, 0.5)",
        elevation: 0,
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    buttonIcon: {
        marginLeft: 8,
    },
})

