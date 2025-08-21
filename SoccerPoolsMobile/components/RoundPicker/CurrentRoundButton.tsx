import { Pressable, Text, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../constants';

interface Props {
    setOpen: (open: boolean) => void;
    currentName: string;
}

export default function CurrentRoundButton({setOpen, currentName}: Props) {

    return (
        <Pressable
            onPress={() => setOpen(true)}
            style={styles.currentBtn}
        >
            <Text
                numberOfLines={1}
                style={styles.currentTxt}
            >
                {currentName.toUpperCase()}
            </Text>
            <Entypo name='chevron-down' color='white' size={17} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    currentBtn: {
        flexShrink: 1,
        width: '70%',
        paddingHorizontal: 14,
        height: 40,
        borderRadius: 20,
        backgroundColor: MAIN_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#d9d9d9',
    },
    currentTxt: { 
        fontSize: 15, 
        fontWeight: '700', 
        color: 'white'
    },
});