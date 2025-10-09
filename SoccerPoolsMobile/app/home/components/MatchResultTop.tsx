import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { MAIN_COLOR } from '../../../constants';
import { ISO8601DateString } from '../../../types';

interface MatchResultTopProps {
    matchState: number
    points: number
    startDate: ISO8601DateString
}

export default function MatchResultTop({matchState, points, startDate}: MatchResultTopProps) {
    const { t } = useTranslation()

    const addLeftZero = (num: number): string => {
        if (num < 10) {
            return `0${num}`
        }
        return num.toString()
    }

    const formatDate = (): string => {
        if (!startDate) {
            return t('undefined-date')
        }
        const isoDate = new Date(startDate)
        const localMonth = addLeftZero(isoDate.getMonth() + 1)
        const localDay = addLeftZero(isoDate.getDate()) 
        const localHours = addLeftZero(isoDate.getHours())
        const localMinutes = addLeftZero(isoDate.getMinutes())

        return `${localHours}:${localMinutes} - ${localDay}/${localMonth}`
    }

    const handleResultText = () => {
        switch (matchState) {
            case 0:
                return formatDate()
            case 1:
                return t('pending')
            case 2:
                return t('finalized')
            case 3:
                return t('cancelled')
            case 4:
                return t('postponed')
            case 5:
                return t('preplayed')
        }
    }
    
    return (
        <View style={styles.topContainer}>
            <Text style={styles.topTxt}>
                {handleResultText()}
            </Text>

            {matchState !== 0 && 
                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsTxt}>{points} pts</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginBottom: 5
    },
    topTxt: {
        fontSize: 16,
        fontWeight: '500'
    },
    pointsContainer: {
        backgroundColor: MAIN_COLOR,
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 3
    },
    pointsTxt: {
        fontSize: 14,
        color: 'white',
        fontWeight: '600'
    }
})