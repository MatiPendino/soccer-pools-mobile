import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FloatingAction } from "react-native-floating-action";
import { useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { MaterialIcons } from "@expo/vector-icons";
import { LeagueProps, TournamentProps } from "../../../types";
import TournamentCard from "../components/TournamentCard";
import { getToken } from "../../../utils/storeToken";
import { listTournaments } from "../../../services/tournamentService";
import { useTranslation } from "react-i18next";
import { userLeague } from "../../../services/leagueService";


export default function Tournaments ({}) {
    const { t } = useTranslation()
    const [tournamentLookup, setTournamentLookup] = useState<string>('')
    const [tournaments, setTournaments] = useState<TournamentProps[]>(null)
    const [leagueId, setLeagueId] = useState<number>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const router = useRouter()
    const toast = useToast()

    useEffect(() => {
        const getLeague = async (): Promise<void> => {
            try {
                const token: string = await getToken()
                /* 
                    Since this function is called everytime the tournamentLookup updates,
                    to avoid fetching the league more than once, if there is a leagueId
                    already stored in the state, call getTournaments directly and return
                */
                if (leagueId) {
                    getTournaments(token, leagueId)
                    return ;
                }

                const league: LeagueProps = await userLeague(token)
                setLeagueId(league.id)
                getTournaments(token, league.id)
            } catch (error) {
                console.log(error)
                toast.show('There is been an error displaying league information', {type: 'danger'})
            } 
        }

        const getTournaments = async (token, leagueId) => {
            try {
                if (token) {
                    const data: TournamentProps[] = await listTournaments(token, leagueId, tournamentLookup)
                    setTournaments(data)
                }
            } catch (error) {
                toast.show(error.toString(), {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }

        getLeague()
    }, [tournamentLookup])

    const actions = []

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <MaterialIcons name="search" size={24} color="#444" style={styles.lookUpIcon} />

                <TextInput
                    placeholder={t('look-for-tournament')}
                    style={styles.lookTntInput}
                    value={tournamentLookup}
                    onChangeText={setTournamentLookup}
                    placeholderTextColor="#444444"
                />

                {tournamentLookup.length > 0 && (
                    <TouchableOpacity onPress={() => setTournamentLookup('')} style={styles.clearIcon}>
                        <MaterialIcons name="clear" size={24} color="#444" />
                    </TouchableOpacity>
                )}
            </View>
            {
                !isLoading
                ?
                    tournaments.length > 0
                    ?
                    <FlatList
                        data={tournaments}
                        renderItem={({item}) => (
                            <TournamentCard 
                                name={item.name}
                                logoUrl={item.logo}
                                adminUsername={item.admin_tournament.username}
                                adminEmail={item.admin_tournament.email}
                                nParticipants={item.n_participants}
                                tournamentId={item.id}
                                leagueId={item.league.id}
                            />
                        )}
                        horizontal={false}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tournamentsContainer}
                    />
                    :
                    <View><Text style={styles.noTournamentTxt}>{t('not-tournament-yet')}</Text></View>
                :
                <ActivityIndicator size="large" color="#0000ff" />
            }
            <FloatingAction
                actions={actions}
                onOpen={() => {
                    router.push({
                        pathname: 'create-tournament',
                        params: {
                            leagueId: leagueId
                        }
                    })
                }}
                color="#0C9A24"
                iconHeight={24}
                iconWidth={24}
                buttonSize={75}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%',
        paddingHorizontal: 10
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 30,
        marginVertical: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, 
    },
    lookTntInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
        color: "#000",
    },
    lookUpIcon: {
        marginRight: 10,
    },
    clearIcon: {
        marginLeft: 10,
    },
    tournamentsContainer: {},
    noTournamentTxt: {
        fontSize: 22,
        textAlign: 'center',
        color: 'white',
        fontWeight: '500',
        marginTop: 150
    },
})