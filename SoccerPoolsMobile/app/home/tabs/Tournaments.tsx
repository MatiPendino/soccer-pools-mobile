import { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Router, useRouter } from 'expo-router';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../../constants';
import { LeagueProps, TournamentProps } from '../../../types';
import TournamentCard from '../components/TournamentCard';
import { getToken } from '../../../utils/storeToken';
import { listTournaments } from '../../../services/tournamentService';
import { useTranslation } from 'react-i18next';
import { userLeague } from '../../../services/leagueService';
import { useBreakpoint } from '../../../hooks/useBreakpoint';


export default function Tournaments ({}) {
    const { t } = useTranslation();
    const [tournamentLookup, setTournamentLookup] = useState<string>('');
    const [tournaments, setTournaments] = useState<TournamentProps[]>(null);
    const [leagueId, setLeagueId] = useState<number>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { isLG } = useBreakpoint();
    const router: Router = useRouter();
    const toast: ToastType = useToast();

    useEffect(() => {
        const getLeague = async (): Promise<void> => {
            try {
                const token: string = await getToken();
                /* 
                    Since this function is called everytime the tournamentLookup updates,
                    to avoid fetching the league more than once, if there is a leagueId
                    already stored in the state, call getTournaments directly and return
                */
                if (leagueId) {
                    getTournaments(token, leagueId);
                    return;
                }

                const league: LeagueProps = await userLeague(token);
                setLeagueId(league.id);
                getTournaments(token, league.id);
            } catch (error) {
                toast.show(
                    'There is been an error displaying league information', {type: 'danger'}
                );
            } 
        }

        const getTournaments = async (token, leagueId) => {
            try {
                if (token) {
                    const data: TournamentProps[] = await listTournaments(
                        token, 
                        leagueId, 
                        tournamentLookup
                    );
                    setTournaments(data);
                }
            } catch (error) {
                toast.show(error.toString(), { type: 'danger' });
            } finally {
                setIsLoading(false);
            }
        }

        getLeague();
    }, [tournamentLookup])

    const actions = [];

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <MaterialIcons name='emoji-events' size={80} color='#ffffff80' />
            <Text style={styles.noTournamentTxt}>{t('not-tournament-yet')}</Text>
            <Text style={styles.emptyStateSubtitle}>{t('create-tournament-tapping-button')}</Text>
        </View>
    );

    const renderLoader = () => (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size='large' color='#ffffff' />
            <Text style={styles.loaderText}>{t('loading-tournaments')}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('tournaments')}</Text>
            </View>
            
            <View style={styles.inputContainer}>
                <MaterialIcons
                    name='search'
                    size={22}
                    color='#666'
                    style={styles.lookUpIcon}
                />

                <TextInput
                    placeholder={t('look-for-tournament')}
                    style={styles.lookTntInput}
                    value={tournamentLookup}
                    onChangeText={setTournamentLookup}
                    placeholderTextColor='#666666'
                />

                {tournamentLookup.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setTournamentLookup('')}
                        style={styles.clearIcon}
                    >
                        <MaterialIcons name='clear' size={20} color='#666' />
                    </TouchableOpacity>
                )}
            </View>

            {
                isLoading 
                ? 
                renderLoader()
                : 
                (tournaments && tournaments.length > 0 
                    ? 
                    <ScrollView 
                        contentContainerStyle={[
                            styles.tournamentsContainer,
                            { width: isLG ? '60%' : '100%' }
                        ]} 
                        showsVerticalScrollIndicator={true}
                    >
                        {tournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.id}
                                name={tournament.name}
                                logoUrl={tournament.logo}
                                adminUsername={tournament.admin_tournament.username}
                                adminEmail={tournament.admin_tournament.email}
                                nParticipants={tournament.n_participants}
                                tournamentId={tournament.id}
                                leagueId={tournament.league.id}
                            />
                        ))}
                    </ScrollView>
                    : 
                    renderEmptyState()
                )
            }

            <FloatingAction
                actions={actions}
                onOpen={() => {
                    router.push({pathname: 'create-tournament', params: {leagueId: leagueId}})
                }}
                color='#0C9A24'
                iconHeight={24}
                iconWidth={24}
                buttonSize={60}
                distanceToEdge={16}
                overlayColor='rgba(0, 0, 0, 0.7)'
                shadow={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        paddingHorizontal: 16,
    },
    header: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 12,
        height: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lookTntInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 8,
        color: '#333',
    },
    lookUpIcon: {
        marginRight: 8,
    },
    clearIcon: {
        padding: 4,
    },
    tournamentsContainer: {
        paddingBottom: 80,
        marginHorizontal: 'auto',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        marginTop: -60,
    },
    noTournamentTxt: {
        fontSize: 22,
        textAlign: 'center',
        color: 'white',
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#ffffff99',
        lineHeight: 22,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -60,
    },
    loaderText: {
        marginTop: 16,
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
})