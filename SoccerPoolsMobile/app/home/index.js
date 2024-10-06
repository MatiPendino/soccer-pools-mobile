import { ScrollView, View, StyleSheet, Text, Image, Pressable, Modal, Button } from "react-native";
import 'react-native-gesture-handler'
import { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import Tournament from "./pages/Tournament";
import HowToPlay from "./pages/HowToPlay";
import Settings from "./pages/Settings";

const Drawer = createDrawerNavigator()

export default function Home({}) {
  const [modalVisible, setModalVisible] = useState(true);  

  const handleDropdownToggle = () => {
    setModalVisible(!modalVisible);  
  };

    return (
        <>
        <Drawer.Navigator 
          initialRouteName="Tournament Name"
          screenOptions={({navigation}) => ({
            drawerStyle: {
              backgroundColor: '#6860A1',
              color: '#fff'
            },
            headerShown: true,
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
                onPress={() => handleDropdownToggle()}
              />
            ),
            headerRight: () => (
              <Ionicons
                name="menu"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          })}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Tournament Name" component={Tournament} />
            <Drawer.Screen name="How To Play" component={HowToPlay} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>  
        <DropdownModal
          visible={modalVisible}
          onClose={handleDropdownToggle}
        />
        </>
        
    )
}

function DropdownModal({ visible, onClose }) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}  
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose an Option</Text>
          <Button title="Option 1" onPress={onClose} />
          <Button title="Option 2" onPress={onClose} />
          <Button title="Option 3" onPress={onClose} />
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ marginTop: 10, fontSize: 18 }}>John Doe</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#6860A1',
        height: '100%'
    }
})