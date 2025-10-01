import { useEffect, useState } from 'react';
import { 
    StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView 
} from 'react-native';
import { ToastType, useToast } from 'react-native-toast-notifications';
import Clipboard from '@react-native-clipboard/clipboard';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import handleError from 'utils/handleError';
import { getToken } from 'utils/storeToken';
import { listMembers } from 'services/userService';
import { useBreakpoint } from 'hooks/useBreakpoint';
import { UserMemberProps } from 'types';
import { MAIN_COLOR, PURPLE_COLOR, SILVER_COLOR, WEBSITE_URL } from '../../constants';
import MemberCard from './components/MemberCard';

export default function Referrals() {
    const [members, setMembers] = useState<UserMemberProps[]>(null);
    const { t } = useTranslation();
    const { isLG } = useBreakpoint();
    const { referralCode } = useLocalSearchParams();
    const toast: ToastType = useToast();

    useEffect(() => {
        const getMembers = async () => {
            try {
                const token: string = await getToken();
                const mems: UserMemberProps[] = await listMembers(token);
                setMembers(mems);
            } catch (error) {
                toast.show(handleError(error), {type: 'error'});
            }    
        }
        
        getMembers();
    }, [])

    const copyToClipboard = () => {
        Clipboard.setString(`${WEBSITE_URL}?referralCode=${referralCode}`);
        toast.show(t('referral-link-success'));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, isLG && styles.headerTitleLG]}>
                    {t('start-winning-today')}!
                </Text>
            </View>

            <View style={[styles.section, styles.inviteContainer]}>
                <Text style={styles.inviteTxt}>{t('invite-new-members')}</Text>

                <Text style={styles.methodsTxt}>{t('your-invitation-methods')}</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={`${WEBSITE_URL}?referralCode=${referralCode}`}
                        editable={false}
                        style={[styles.input, {fontSize: isLG ? 16 : 12}]}
                    />
                    <TouchableOpacity 
                        onPress={copyToClipboard}
                        style={styles.copyButton}
                    >
                        <Feather name='copy' size={isLG ? 24 : 20} color='white' />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.section, styles.membersContainer]}>
                <Text style={styles.membersTxt}>{t('members')}</Text>

                {
                    members?.length > 0
                    ?
                    members.map(member => (
                        <MemberCard key={member.username}
                            username={member.username}
                            profile_image={member.profile_image}
                            created_at={member.created_at}
                        />
                    ))
                    :
                    <View style={styles.emptyContainer}>
                        <Feather name='users' size={40} color={SILVER_COLOR} />
                        <Text style={styles.emptyText}>{t('no-members-yet')}</Text>
                        <Text style={styles.emptySubtext}>{t('share-referral-link')}</Text>
                    </View>
                }
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MAIN_COLOR,
        paddingVertical: 16,
    },
    header: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: 'white',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    headerTitleLG: {
        fontSize: 36,
    },
    section: {
        backgroundColor: PURPLE_COLOR,
        borderRadius: 20,
        marginTop: 20,
        padding: 20,
        marginHorizontal: 16,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    inviteContainer: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    inviteTxt: {
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
        lineHeight: 24,
        textAlign: 'center',
    },
    methodsTxt: {
        color: SILVER_COLOR,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        paddingRight: 50, 
        //fontSize: 16,
        fontWeight: '500',
    },
    copyButton: {
        position: 'absolute',
        right: 12,
        padding: 8,
    },
    membersContainer: {
        marginTop: 24,
    },
    membersTxt: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        marginBottom: 16,
    },
    listStyle: {
        paddingVertical: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtext: {
        color: SILVER_COLOR,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 32,
    },
});