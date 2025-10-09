import { View, StyleSheet, Pressable, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TournamentProps } from 'types';

interface MenuWebProps {
    tournament: TournamentProps;
    t: (key: string) => string;
    handleTournamentClick: (slug: string) => void;
    handleShare: () => void;
}

export default function MenuWeb({
    tournament, t, handleTournamentClick, handleShare
}: MenuWebProps) {

    return (
        <View style={[styles.menuWebContainer]}>
            <Pressable onPress={handleShare}>
                <Text style={styles.menuTxt}>{t('invite-friends')}</Text>
            </Pressable> 
            {
                tournament && tournament.is_current_user_admin &&
                <View style={styles.innerMenuWebContainer}>
                    <Pressable onPress={
                        () => handleTournamentClick('pending-invites')
                    }>
                        <Text style={styles.menuTxt}>{t('pending-invites')}</Text>
                    </Pressable>
                    <Pressable onPress={
                        () => handleTournamentClick('edit-tournament')
                    } 
                    style={{justifyContent: 'center', marginEnd: 10}} 
                    accessibilityRole='button'
                    >
                        <Ionicons name='settings-sharp' size={20} color='white' />
                    </Pressable>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    menuWebContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 30,
    },
    innerMenuWebContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 30,
    },
    menuTxt: {
        color: 'white',
        textTransform: 'uppercase',
        fontFamily: 'Segoe UI',
        fontSize: 20,
        fontWeight: '500',
    }
})