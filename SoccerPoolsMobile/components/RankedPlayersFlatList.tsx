import RankedPlayer from "./RankedPlayer"
import { StyleSheet, ScrollView } from "react-native"
import { BetProps, CoinsPrizes } from "../types"

interface Props {
    bets: BetProps[]
    coinsPrizes?: CoinsPrizes
}

export default function RankedPlayersFlatList ({bets, coinsPrizes}: Props) {

    return (
        <ScrollView contentContainerStyle={styles.betResultsContainer} showsVerticalScrollIndicator={true}>
            {bets.map((item, index) => (
                <RankedPlayer 
                    key={item.id}
                    index={index+1} 
                    username={item.username}
                    points={item.points}
                    profileImageUrl={item.profile_image}
                    coinPrizes={coinsPrizes}
                />
            ))}
        </ScrollView>
            
    )
}

const styles = StyleSheet.create({
    betResultsContainer: {
        paddingBottom: 70,
        flexGrow: 1
    },
})