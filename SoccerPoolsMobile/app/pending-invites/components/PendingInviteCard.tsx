import { StyleSheet, View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import handleError from '../../../utils/handleError';
import { useBreakpoint } from '../../../hooks/useBreakpoint';
import { useUpdateStateTournamentUser } from '../../../hooks/useTournaments';

interface PendingInviteCardProps {
    id: number;
    username: string;
    userLogoUrl: string;
}

export default function PendingInviteCard({
    id, username, userLogoUrl
}: PendingInviteCardProps) {
    const { t } = useTranslation();
    const toast: ToastType = useToast();
    const { isLG } = useBreakpoint();

    const { mutate: updateState, isPending: isLoading } = useUpdateStateTournamentUser();

    const handlePendingInvite = (isAccept: boolean) => {
        const tournamentState = isAccept ? 2 : 3;
        updateState({ tournamentUserId: id, tournamentState }, {
            onSuccess: () => {
                toast.show(t('success'), {type: 'success'});
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        });
    }

    return (
        <View style={styles.container}>
            <Image 
                source={{uri: `${userLogoUrl}`}}
                style={[styles.userLogoImg, {
                    width: isLG ? 60 : 45,
                    height: isLG ? 60 : 45
                }]}
            />
            <Text style={[styles.usernameTxt, {fontSize: isLG ? 18 : 15,}]}>{username}</Text>
            {
                isLoading
                ?
                    <ActivityIndicator size='large' color='#0000ff' />
                :
                    <View style={styles.btnsContainer}>
                        <Pressable 
                            style={[styles.btn, styles.acceptBtn]} 
                            onPress={() => handlePendingInvite(true)}
                        >
                            <Text style={[styles.btnTxt]}>{t('accept')}</Text>
                        </Pressable>
                        <Pressable 
                            style={[styles.btn, styles.rejectBtn]} 
                            onPress={() => handlePendingInvite(false)}
                        >
                            <Text style={[styles.btnTxt, { fontSize: isLG ? 16 : 13 }]}>
                                {t('reject')}
                            </Text>
                        </Pressable>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#dedede',
        paddingVertical: 10,
        borderRadius: 7
    },
    userLogoImg: {
        borderRadius: 100,
        objectFit: 'cover'
    },
    usernameTxt: {
        marginVertical: 'auto',
    },
    btnsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 'auto',
        gap: 10,
    },
    btn: {
        borderRadius: 4,
        padding: 7,
    },
    acceptBtn: {
        backgroundColor: '#0C9A24'
    },
    rejectBtn: {
        backgroundColor: '#C52424'
    },
    btnTxt: {
        color: 'white',
        fontWeight: '500',
    },
})