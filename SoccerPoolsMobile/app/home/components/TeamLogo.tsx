import { View, Image, StyleSheet, Text } from 'react-native';
import { useBreakpoint } from '../../../hooks/useBreakpoint';

interface TeamLogoProps {
    teamBadge: string;
    teamAcronym: string;
}

export default function TeamLogo({teamBadge, teamAcronym}: TeamLogoProps) {
    const { isSM, isMD } = useBreakpoint();
    const isMobile = isSM || isMD;

    return (
        <View style={[
            styles.teamContainer,
            isMobile && styles.teamContainerMobile
        ]}>
            <Image
                style={[
                    styles.teamImg,
                    isMobile && styles.teamImgMobile
                ]}
                source={{ uri: `${teamBadge}`}}
            />
            <Text style={[
                styles.teamAcronym,
                isMobile && styles.teamAcronymMobile
            ]}>
                {teamAcronym}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    teamContainer: {
        width: 110,
        textAlign: 'center',
        marginVertical: 'auto'
    },
    teamContainerMobile: {
        width: 75,
    },
    teamImg: {
        width: 50,
        height: 50,
        objectFit: 'contain',
        marginHorizontal: 'auto'
    },
    teamImgMobile: {
        width: 42,
        height: 42,
    },
    teamAcronym: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
    },
    teamAcronymMobile: {
        fontSize: 17,
    },
})