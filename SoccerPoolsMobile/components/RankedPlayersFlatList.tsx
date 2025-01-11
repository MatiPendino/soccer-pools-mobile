import { FlatList } from "react-native-gesture-handler"
import RankedPlayer from "./RankedPlayer"
import { StyleSheet } from "react-native"
import { BetProps } from "../types"

interface Props {
    bets: BetProps[]
}

export default function RankedPlayersFlatList ({bets}: Props) {

    return (
        <FlatList
            data={bets}
            renderItem={({item, index}) => (
                <RankedPlayer 
                    index={index+1} 
                    username={item.username}
                    points={item.points}
                    profileImageUrl={item.profile_image}
                />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.betResultsContainer}
            horizontal={false} 
            showsVerticalScrollIndicator={true}
        />
    )
}

const styles = StyleSheet.create({
    betResultsContainer: {
        paddingBottom: 70,
        flexGrow: 1
    },
})