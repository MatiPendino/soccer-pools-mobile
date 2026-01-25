import { Router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { Banner } from 'components/ads/Ads';
import { colors } from '../../theme';
import { getWrapper } from '../../utils/getWrapper';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { usePendingTournamentUsers } from '../../hooks/useTournaments';
import PendingInviteCard from './components/PendingInviteCard';

export default function PendingInvites() {
    const { t } = useTranslation();
    const { tournamentId } = useLocalSearchParams();
    const { isLG } = useBreakpoint();
    const router: Router = useRouter();

    const { data: pendingTournamentUsers, isLoading } = usePendingTournamentUsers(
        Number(tournamentId)
    );

    const Wrapper = getWrapper();

    return (
        <Wrapper style={styles.container}>
            <View style={styles.topBar}>
                <Pressable onPress={() => router.push(`/my-tournament/${tournamentId}`)}>
                    <Entypo name='chevron-left' color='white' size={30} />
                </Pressable>
                <Text style={styles.topBarTxt}>{t('pending-invites')}</Text>
            </View>

            {
                isLoading
                ?
                    <ActivityIndicator size='large' color={colors.primary} />
                :
                    pendingTournamentUsers && pendingTournamentUsers.length > 0
                    ?
                        <ScrollView 
                            contentContainerStyle={[
                                styles.invitesContainer, { width: isLG ? '45%' : '97%'}
                            ]} 
                            showsVerticalScrollIndicator={true}
                        >
                            {pendingTournamentUsers.map((pendingUser) => (
                                <PendingInviteCard
                                    key={pendingUser.id}
                                    id={pendingUser.id}
                                    username={pendingUser.user.username}
                                    userLogoUrl={pendingUser.user.profile_image}
                                />
                            ))}
                        </ScrollView>
                    :
                        <View style={styles.noPendingInvites}>
                            <Text style={styles.noPendingInvitesTxt}>
                                {t('no-pending-invites')}
                            </Text>
                        </View>
            }

            <Banner bannerId={process.env.PENDING_INVITES_BANNER_ID} />
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.primaryDarker,
        flex: 1,
    },
    topBar: {
        backgroundColor: colors.primaryDark,
        flexDirection: 'row',
        paddingVertical: 15,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        marginBottom: 10,
        paddingHorizontal: 5
    },
    topBarTxt: {
        color: colors.white,
        fontSize: 20,
        fontWeight: '500',
        marginStart: 5
    },
    invitesContainer: {
        paddingHorizontal: 10,
        marginHorizontal: 'auto',
    },
    noPendingInvites: {
        marginVertical: 'auto'
    },
    noPendingInvitesTxt: {
        color: colors.white,
        fontSize: 23,
        fontWeight: '600',
        textAlign: 'center'
    }
});