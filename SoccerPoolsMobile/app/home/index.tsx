import { useState, useEffect } from "react";
import { Platform, useWindowDimensions, View, Text, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Entypo from '@expo/vector-icons/Entypo';
import { useToast } from "react-native-toast-notifications";
import { MAIN_COLOR } from "../../constants";
import League from "./screens/League";
import HowToPlay from "./screens/HowToPlay";
import styles from "./styles";
import { getToken } from "../../utils/storeToken";
import { getFullUser } from "../../services/authService";
import { removeToken } from "../../services/api";
import handleShare from "../../utils/handleShare";
import { useTranslation } from "react-i18next";
import CoinsDisplay from "../../components/CoinsDisplay";
import RateAppModal from "../../components/RateAppModal";
import { useBreakpoint } from '../../hooks/useBreakpoint';

const Drawer = createDrawerNavigator()

export default function Home () {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCoins, setCurrentCoins] = useState<number>(0);
  const toast = useToast();
  const router = useRouter();
  const { isLG } = useBreakpoint();

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const u = await getFullUser(token);
        setCurrentCoins(u.coins);
        setUser(u);
      } catch {
        toast.show('There was an error retrieving the user details', { type: 'danger' });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const logOut = async () => {
    try {
      await removeToken();
      await AsyncStorage.removeItem('FCMToken');
      toast.show(t('session-finished'), { type: 'success' });
      router.replace('/');
    } catch {
      toast.show('There was an error logging out', { type: 'danger' });
    }
  };

  return (
    <Drawer.Navigator
      id={undefined}
      initialRouteName="home"
      // Permanent on web, slide on mobile
      screenOptions={{
        drawerType: isLG ? 'permanent' : 'slide',
        swipeEnabled: !isLG,
        overlayColor: 'transparent',
        drawerStyle: {
          backgroundColor: MAIN_COLOR,
        },
        headerStyle: { backgroundColor: '#2F2766' },
        headerTintColor: 'white',
        // Hide the hamburger toggle when permanent
        headerLeft: isLG ? () => null : undefined,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CoinsDisplay setCoins={setCurrentCoins} coins={isLoading ? '...' : currentCoins} />
            <RateAppModal setCoins={setCurrentCoins} />
          </View>
        ),
        headerRightContainerStyle: { paddingRight: 16 },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ justifyContent: 'space-between' }} style={styles.container}>
          <View style={styles.drawerNavbar}>
            <Text style={styles.nameTxt}>{isLoading ? '...' : `${user.name} ${user.last_name}`}</Text>
            <Text style={styles.emailTxt}>{isLoading ? '...' : user.email}</Text>
            <Link style={styles.editTxt} href="edit-account">{t('update-account')}</Link>
          </View>
          <View style={styles.itemsContainer}>
            <DrawerItemList {...props} />
            <Pressable onPress={() => router.push('/select-league')} style={styles.shareBtn}>
              <Entypo name="game-controller" size={22} color="white" />
              <Text style={styles.shareTxt}>{t('leagues')}</Text>
            </Pressable>
            <Pressable onPress={handleShare} style={styles.shareBtn}>
              <Entypo name="share" size={22} color="white" />
              <Text style={styles.shareTxt}>{t('share')}</Text>
            </Pressable>
            <View style={styles.socialMediaContainer}>
                <Link href='https://www.instagram.com/tuprodefutbol/' style={styles.socialMediaBtn}>
                  <Entypo name="instagram" size={45} color="white" />
                </Link>
                <Link href='https://x.com/tuprodefutbol' style={styles.socialMediaBtn}>
                  <Entypo name="twitter" size={45} color="white" />
                </Link>
            </View>
          </View>
          <Pressable onPress={() => logOut()} style={styles.logoutBtn}>
            <Entypo name="log-out" size={24} color="white" />
            <Text style={styles.logoutTxt}>{t('log-out')}</Text>
          </Pressable>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="home"
        component={League}
        options={{
          drawerLabel: t('home'),
          drawerLabelStyle: { color: 'white', fontSize: 24 },
          drawerIcon: () => <Entypo name="home" color="white" size={22} />,
        }}
      />
      <Drawer.Screen
        name="how-to-play"
        component={HowToPlay}
        options={{
          drawerLabel: t('how-to-play'),
          drawerLabelStyle: { color: 'white', fontSize: 24 },
          drawerIcon: () => <Entypo name="help" color="white" size={22} />,
        }}
      />
    </Drawer.Navigator>
  );
}
