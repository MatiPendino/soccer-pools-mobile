import { View } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Leaderboard from "./components/Leaderboard";
import Results from "./components/Results";

const Tab = createBottomTabNavigator()

export default function League({}) {
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
                <Tab.Screen name="Leaderboard" component={Leaderboard} />
                <Tab.Screen name="Results" component={Results} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}