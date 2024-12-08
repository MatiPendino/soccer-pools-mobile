import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native"
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { userLeague, roundsListByLeague } from "../../../services/leagueService";
import { getToken } from "../../../utils/storeToken";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Leaderboard from "../components/Leaderboard";
import Results from "../components/Results";
import { LeagueProps, RoundProps, RoundsStateProps } from "../../../types";

const Tab = createBottomTabNavigator()

export default function League({}) {
  const [league, setLeague] = useState<LeagueProps>(null)
  const [rounds, setRounds] = useState<RoundProps[]>([])
  const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const getLeague = async (): Promise<void> => {
      const token: string = await getToken()
      const temp_league: LeagueProps = await userLeague(token)
      setLeague(temp_league)
      getRounds(token, temp_league)
    }

    const getRounds = async (token: string, leag: LeagueProps) => { 
      try {
        if (leag) {
          const roundsByLeague: RoundProps[] = await roundsListByLeague(token, leag.id)
          setRounds(roundsByLeague)  

          /* 
            To manage the current selected round, create a list of objects 
            in the format roundSlug: boolean.
            Initially, the first round will be true, and the rest false
          */
          const roundsStateObject = roundsByLeague.reduce((
            activeRoundsState: RoundsStateProps, round: RoundProps, index: number
          ) => {
            activeRoundsState[round.slug] = index === 0; 
            return activeRoundsState
          }, {} as RoundsStateProps)
          setRoundsState(roundsStateObject)
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
              id={undefined}
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