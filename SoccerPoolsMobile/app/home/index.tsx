import { useState, useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, Share} from "react-native";
import { Link } from "expo-router";
import 'react-native-gesture-handler'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Entypo from '@expo/vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import { useRouter } from "expo-router";
import League from "./screens/League";
import HowToPlay from "./screens/HowToPlay";
import styles from "./styles"
import { getToken } from "../../utils/storeToken";
import { getUser } from "../../services/authService";
import { removeToken } from "../../services/api";

const Drawer = createDrawerNavigator()

export default function Home({}) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const router = useRouter()

  useEffect(() => {
    const retrieveUser = async () => {
      try {
        const token = await getToken()
        if (token) {
          const user = await getUser(token)
          setUser(user)
        }
      } catch (error) {
        toast.show('There was an error retrieving the user details', {type: 'danger'})
      } finally {
        setIsLoading(false)
      }
    }

    retrieveUser()
  }, [])

  const logOut = async () => {
    try {
      await removeToken()
      toast.show('Session finishes', {type: 'success'})
      router.replace('/')
    } catch (error) {
      toast.show('There was an error logging out', {type: 'danger'})
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: "Pronosticate all the results and win! Download it here: https://example.com",
      })
    } catch (error) {
      console.error("Error sharing content:", error.message)
    }
  }

  if (isLoading) {return <ActivityIndicator size="large" color="#0000ff" />}

  return (
    <Drawer.Navigator
      id={undefined}
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: "#6860A1",
          color: "white",
        },
        headerShown: true,
      })}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ justifyContent: "space-between" }} style={styles.container}>
          <View style={styles.drawerNavbar}>
            <Text style={styles.nameTxt}>
              {user.name} {user.last_name}
            </Text>
            <Text style={styles.emailTxt}>{user.email}</Text>

            <Link style={styles.editTxt} href="edit-account">
              EDIT ACCOUNT
            </Link>
          </View>
          <View style={styles.itemsContainer}>
            <DrawerItemList {...props} />
            <Pressable onPress={handleShare} style={styles.shareBtn}>
              <Entypo name="share" size={22} color="white" />
              <Text style={styles.shareTxt}>Share</Text>
            </Pressable>
            <View style={styles.socialMediaContainer}>
                <Link href='https://instagram.com' style={styles.socialMediaBtn}>
                  <Entypo name="instagram" size={45} color="white" /></Link>
                <Link href='https://twitter.com' style={styles.socialMediaBtn}>
                  <Entypo name="twitter" size={45} color="white" />
                </Link>
            </View>
            
          </View>
          <Pressable onPress={() => logOut()} style={styles.logoutBtn}>
            <Entypo name="log-out" size={24} color="white" />
            <Text style={styles.logoutTxt}>LOGOUT</Text>
          </Pressable>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Home"
        component={League}
        options={{
          drawerLabelStyle: {
            color: "white",
            fontSize: 24,
          },
          drawerIcon: () => <Entypo name="game-controller" color="white" size={22} />,
        }}
      />
      <Drawer.Screen
        name="How To Play"
        component={HowToPlay}
        options={{
          drawerLabelStyle: {
            color: "white",
            fontSize: 24,
          },
          drawerIcon: () => <Entypo name="help" color="white" size={22} />,
        }}
      />
    </Drawer.Navigator>
  )
}