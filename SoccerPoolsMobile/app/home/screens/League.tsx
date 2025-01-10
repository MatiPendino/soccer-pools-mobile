import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native"
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { userLeague } from "../../../services/leagueService";
import { getToken } from "../../../utils/storeToken";
import { ToastType, useToast } from "react-native-toast-notifications";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Leaderboard from "../components/Leaderboard";
import Results from "../components/Results";
import { LeagueProps, RoundProps, RoundsStateProps } from "../../../types";
import Tournaments from "../components/Tournaments";
import { getRounds, getRoundsState } from "../../../utils/leagueRounds";

const Tab = createBottomTabNavigator()

export default function League({}) {
  const [league, setLeague] = useState<LeagueProps>(null)
  const [rounds, setRounds] = useState<RoundProps[]>([])
  const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const toast: ToastType = useToast()

  useEffect(() => {
    const getLeague = async (): Promise<void> => {
      try {
        const token: string = await getToken()
        const temp_league: LeagueProps = await userLeague(token)
        setLeague(temp_league)
        const roundsByLeague = await getRounds(token, temp_league.id)
        setRounds(roundsByLeague)
        setRoundsState(getRoundsState(rounds))
      } catch (error) {
        console.log(error)
        toast.show('There is been an error displayinh league information', {type: 'danger'})
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
                    if (route.name === 'Leaderboard') {
                      return <MaterialIcons name="sports-soccer" size={40} color="black" />
                    } else if (route.name === 'Results') {
                      return <MaterialIcons name="leaderboard" size={40} color="black" />
                    } else if (route.name === 'Tournaments') {
                      return <MaterialIcons name='group' size={40} color='black' />
                    }            
                  },
                  headerShown: false,
                  tabBarActiveTintColor: 'tomato',
                  tabBarInactiveTintColor: 'gray',
                  tabBarStyle: { display: 'flex' },
              })}
          >
              <Tab.Screen name="Results">
                {() => <Results rounds={rounds} setRoundsState={setRoundsState} roundsState={roundsState} />}
              </Tab.Screen>
              <Tab.Screen name="Leaderboard">
                {() => <Leaderboard rounds={rounds} setRounds={setRounds} setRoundsState={setRoundsState} roundsState={roundsState} />}
              </Tab.Screen>
              <Tab.Screen name="Tournaments">
                {() => <Tournaments leagueId={league.id} />}
              </Tab.Screen>
          </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}