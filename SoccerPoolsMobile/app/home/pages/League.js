import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { userLeague, roundsListByLeague } from "../../../services/leagueService";
import { getToken } from "../../../utils/storeToken";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Leaderboard from "./components/Leaderboard";
import Results from "./components/Results";

const Tab = createBottomTabNavigator()

export default function League({}) {
  const [league, setLeague] = useState(null)
  const [rounds, setRounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getLeague = async () => {
      const token = await getToken()
      const league = await userLeague(token)
      setLeague(league)
      getRounds(token)
    }

    const getRounds = async (token) => {
      try {
        if (league) {
          const roundsByLeague = await roundsListByLeague(token, league.id)
          setRounds(roundsByLeague)  
        }
        
      } catch (error) {
        throw error.response.data
      } finally {
        setIsLoading(false)
      }
    }

    getLeague()
  }, [])

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  return (
      <NavigationContainer independent={true}>
          <Tab.Navigator
              screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'Leaderboard') {
                      return <MaterialIcons name="sports-soccer" size={40} color="black" />
                    } else if (route.name === 'Results') {
                      return <MaterialIcons name="leaderboard" size={40} color="black" />
                    }                      
                  },
                  headerShown: false,
                  tabBarActiveTintColor: 'tomato',
                  tabBarInactiveTintColor: 'gray',
                  tabBarStyle: { display: 'flex' },
              })}
          >
              <Tab.Screen name="Leaderboard">
                {() => <Leaderboard rounds={rounds} />}
              </Tab.Screen>
              <Tab.Screen name="Results">
                {() => <Results rounds={rounds} />}
              </Tab.Screen>
          </Tab.Navigator>
      </NavigationContainer>
  )
}