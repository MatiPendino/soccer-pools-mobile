import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Leaderboard from './tabs/Leaderboard';
import Results from './tabs/Results';
import Tournaments from './tabs/Tournaments';

const Tab = createBottomTabNavigator()

export default function League({}) {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
          <Tab.Navigator
              id={undefined}
              screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {        
                    if (route.name === 'Leaderboard') {
                      return <MaterialIcons name='sports-soccer' size={40} color='black' />
                    } else if (route.name === 'Results') {
                      return <MaterialIcons name='leaderboard' size={40} color='black' />
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
              <Tab.Screen name='Results'>
                {() => <Results />}
              </Tab.Screen>
              <Tab.Screen name='Leaderboard'>
                {() => <Leaderboard />}
              </Tab.Screen>
              <Tab.Screen name='Tournaments'>
                {() => <Tournaments />}
              </Tab.Screen>
          </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}
  