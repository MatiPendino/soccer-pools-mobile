import { View, StyleSheet, Image, Text } from "react-native"
import { FontAwesome5 } from '@expo/vector-icons'
import { CoinsPrizes } from "../types";
import { BRONZE_COLOR, GOLD_COLOR, SILVER_COLOR } from "../constants";

interface RankedPlayerProps {
  index: number
  profileImageUrl: string
  username: string
  points: number
  coinPrizes?: CoinsPrizes
}

export default function RankedPlayer({ index, profileImageUrl, username, points, coinPrizes }: RankedPlayerProps) {

  // Special styling for top 3 ranks
  const rankStyles = (() => {
    if (index === 1) {
      return {
        container: styles.goldContainer,
        index: styles.goldIndex,
        medal: require("../assets/img/trophy-cup.png"),
        showMedal: true,
        prize: coinPrizes?.coins_prize_first,
        prizeColor: GOLD_COLOR, 
      }
    } else if (index === 2) {
      return {
        container: styles.silverContainer,
        index: styles.silverIndex,
        medal: require("../assets/img/silver-medal.png"),
        showMedal: true,
        prize: coinPrizes?.coins_prize_second,
        prizeColor: SILVER_COLOR, 
      }
    } else if (index === 3) {
      return {
        container: styles.bronzeContainer,
        index: styles.bronzeIndex,
        medal: require("../assets/img/bronze-medal.png"),
        showMedal: true,
        prize: coinPrizes?.coins_prize_third,
        prizeColor: BRONZE_COLOR
      }
    } else {
      return {
        container: styles.defaultContainer,
        index: styles.defaultIndex,
        showMedal: false,
        prize: null,
      }
    }
  })()

  return (
    <View style={[styles.container, rankStyles.container]}>
      <View style={styles.rankContainer}>
        {rankStyles.showMedal ? (
          <Image source={rankStyles.medal} style={styles.medalIcon} />
        ) : (
          <Text style={[styles.indexTxt, rankStyles.index]}>{index}</Text>
        )}
      </View>

      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileImageUrl }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.usernameTxt} numberOfLines={1} ellipsizeMode="tail">
          {username}
        </Text>

        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Points:</Text>
          <Text style={styles.pointsTxt}>{points}</Text>
        </View>
        
        {rankStyles.prize && (
          <View style={[styles.prizeContainer, { borderColor: rankStyles.prizeColor }]}>
            <FontAwesome5 name="coins" size={16} color="#f59e0b" />
            <Text style={styles.prizeTxt}>
              {rankStyles.prize}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 15,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  defaultContainer: {
    backgroundColor: "#ffffff",
  },
  goldContainer: {
    backgroundColor: "#FFF9E6",
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  silverContainer: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#C0C0C0",
  },
  bronzeContainer: {
    backgroundColor: "#FFF0E6",
    borderWidth: 1,
    borderColor: "#CD7F32",
  },
  rankContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  indexTxt: {
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
  },
  defaultIndex: {
    color: "#414141",
  },
  goldIndex: {
    color: "#FFD700",
  },
  silverIndex: {
    color: "#C0C0C0",
  },
  bronzeIndex: {
    color: "#CD7F32",
  },
  medalIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E1E1E1",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  usernameTxt: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "600",
    marginBottom: 4,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 14,
    color: "#666666",
    marginRight: 4,
  },
  pointsTxt: {
    fontWeight: "700",
    fontSize: 16,
    color: "#2F2766",
  },
  prizeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  prizeTxt: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f59e0b",
    marginLeft: 4,
  },
})