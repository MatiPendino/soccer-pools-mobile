import { View, Image, Text, StyleSheet } from 'react-native';
import { SILVER_COLOR } from '../../../constants';

interface Props {
    username: string;
    profile_image: string;
    created_at: string;
}

export default function MemberCard ({username, profile_image, created_at}: Props) {

    return (
        <View style={styles.memberItem}>
            <Image 
                source={{ uri: profile_image }} 
                style={styles.avatar}
            />
            <View style={styles.memberInfo}>
                <Text style={styles.memberUsername}>{username}</Text>
                <Text style={styles.memberDate}>
                    {new Date(created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    memberInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    memberUsername: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    memberDate: {
        color: SILVER_COLOR,
        fontSize: 12,
        marginTop: 2,
    },
})