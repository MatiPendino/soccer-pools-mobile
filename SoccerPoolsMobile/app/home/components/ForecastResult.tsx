import { useTranslation } from "react-i18next"
import { View, Text, StyleSheet } from "react-native"

interface ForecastResultProps {
    forecastGoalsTeam1: number
    forecastGoalsTeam2: number
    goalsTeam1: number
    goalsTeam2: number
    matchState: number
}

export default function ForecastResult ({
    forecastGoalsTeam1, forecastGoalsTeam2, goalsTeam1, goalsTeam2, matchState
}: ForecastResultProps) {
    const { t } = useTranslation()
    const handleResultGoals = (goalsTeam: number) => {
        return matchState === 1 ? '' : goalsTeam.toString()
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.resultTxt, styles.text]}>{t('result')}</Text>
            <Text style={[styles.resultNumbersTxt, styles.text]}>
                {handleResultGoals(goalsTeam1)} - {handleResultGoals(goalsTeam2)}
            </Text>

            <View style={styles.forecastContainer}>
                <Text style={[styles.forecastTxt, styles.text]}>{t('your-forecast')}</Text>
                <Text style={[styles.forecastNumbersTxt, styles.text]}>
                    {forecastGoalsTeam1} - {forecastGoalsTeam2}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    },
    text: {
        textAlign: 'center',
        fontWeight: '500'
    },
    resultTxt: {
        fontSize: 16
    },
    resultNumbersTxt: {
        fontSize: 16
    },
    forecastContainer: {
        backgroundColor: '#D9D9D9',
        borderRadius: 5,
        paddingHorizontal: 7,
        paddingVertical: 4,
        marginTop: 4
    },
    forecastTxt: {
        fontSize: 13
    },
    forecastNumbersTxt: {
        fontSize: 13
    }

})