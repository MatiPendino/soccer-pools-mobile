import { View, Text, Pressable, StyleSheet } from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler"


export default function Leaderboard ({rounds}) {
    return (
        <GestureHandlerRootView>
            <FlatList
                data={rounds}
                renderItem={({item}) => (
                    <Pressable onPress={() => {console.log("testing")}}>
                        <Text>{item.name} quiero que sobrepase la pantalla</Text>
                    </Pressable>
                )}
                horizontal={true}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.leaguesContainer}
            />
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    }
})