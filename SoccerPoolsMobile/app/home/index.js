import { ScrollView, View, StyleSheet, Text, Image, Pressable, Modal, Button } from "react-native";
import 'react-native-gesture-handler'
import { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import { Menu, Divider } from "react-native-paper";
import Tournament from "./pages/Tournament";
import HowToPlay from "./pages/HowToPlay";
import Settings from "./pages/Settings";
import styles from "./styles"

const Drawer = createDrawerNavigator()

export default function Home({}) {
  return (
    <>
      <Drawer.Navigator 
        initialRouteName="Tournament Name"
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
        <Drawer.Screen name="Home" component={Tournament} />
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