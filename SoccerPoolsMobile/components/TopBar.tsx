import { Entypo } from '@expo/vector-icons';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Link } from 'expo-router';

interface Props {
    text: string
    url: string
}

export default function TopBar ({text, url}: Props) {

    return (
        <View style={styles.topBar}>
            <Link href={url}>
                <Entypo name='chevron-left' color='white' size={30} />
            </Link>
            <Text style={styles.topBarTxt}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        backgroundColor: '#2F2766',
        flexDirection: 'row',
        paddingVertical: 15,
        marginTop: Platform.OS === 'web' ? 0 : 20,
        marginBottom: 10,
        paddingHorizontal: 5,
        width: '100%'
    },
    topBarTxt: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        marginStart: 5
    },
});