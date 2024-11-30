import { View, Text, Pressable } from "react-native";
import 'react-native-gesture-handler'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Entypo from '@expo/vector-icons/Entypo';
import League from "./screens/League";
import HowToPlay from "./screens/HowToPlay";
import Settings from "./screens/Settings";
import styles from "./styles"

const Drawer = createDrawerNavigator()

export default function Home({}) {
  return (
    <>
      <Drawer.Navigator 
        initialRouteName="Home"
        screenOptions={({navigation}) => ({
          drawerStyle: {
            backgroundColor: '#fff',
            color: '#fff'
          },
          headerShown: true,
          /*headerRight: () => (
            <Ionicons
              name="menu"
              size={24}
              color="black"
              style={{ marginRight: 10 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),*/
        })}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={League} />
        <Drawer.Screen name="How To Play" component={HowToPlay} />
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>  
    </>
  )
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerNavbar}>
        <Text style={styles.nameTxt}>Matías Pendino</Text>
        <Text style={styles.emailTxt}>matiaspendino76@gmail.com</Text>

        <Pressable styles={styles.editBtn} onPress={() => {}}>
          <Text style={styles.editTxt}>EDIT ACCOUNT</Text>
        </Pressable>
      </View>
      <DrawerItemList {...props} />
      <View style={styles.instaContainer}>
        <Entypo name="instagram" size={45} color="black" />
      </View>
      <Pressable onPress={() => {}} style={styles.logoutBtn}>
        <Entypo name="log-out" size={24} color="white" />
        <Text style={styles.logoutTxt}>LOGOUT</Text>
      </Pressable>
    </DrawerContentScrollView>
  )
}