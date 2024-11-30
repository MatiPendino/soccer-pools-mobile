import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native"
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { userLeague, roundsListByLeague } from "../../../services/leagueService";
import { getToken } from "../../../utils/storeToken";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Leaderboard from "../components/Leaderboard";
import Results from "../components/Results";

const Tab = createBottomTabNavigator()

export default function League({}) {
  const [league, setLeague] = useState(null)
  const [rounds, setRounds] = useState([])
  const [roundsState, setRoundsState] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getLeague = async () => {
      const token = await getToken()
      const temp_league = await userLeague(token)
      setLeague(temp_league)
      getRounds(token, temp_league)
    }

    const getRounds = async (token, leag) => { 
      try {
        if (leag) {
          const roundsByLeague = await roundsListByLeague(token, leag.id)
          setRounds(roundsByLeague)  

          /* 
            To manage the current selected round, create a list of objects 
            in the format roundSlug: boolean.
            Initially, the first round will be true, and the rest false
          */
          /*const roundsStateList = roundsByLeague.map((round, index) => {
            return { [round.slug]: index === 0 }; 
          })
          setRoundsState(roundsStateList)*/

          const roundsStateObject = roundsByLeague.reduce((acc, round, index) => {
            acc[round.slug] = index === 0; 
            return acc;
          }, {});
          setRoundsState(roundsStateObject);
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
    <NavigationIndependentTree>
      <NavigationContainer>
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
                {() => <Leaderboard rounds={rounds} setRoundsState={setRoundsState} roundsState={roundsState} />}
              </Tab.Screen>
              <Tab.Screen name="Results">
                {() => <Results rounds={rounds} />}
              </Tab.Screen>
          </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}