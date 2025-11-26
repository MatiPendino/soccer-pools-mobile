import { View, Text, Pressable, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import {
  FACEBOOK_URL, INSTAGRAM_URL, MAIN_COLOR, MAIN_COLOR_OPACITY, TWITTER_URL
} from '../../constants';
import styles from './styles';
import CoinsDisplay from '../../components/CoinsDisplay';
import RateAppModal from '../../components/RateAppModal';
import handleShare from '../../utils/handleShare';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { toCapitalCase } from 'utils/helper';
import { useFullUser } from '../../hooks/useUser';
import { removeToken } from 'services/api';

export default function HomeLayout() {
  const { isSM, isLG, isXXL } = useBreakpoint();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();

  const { data: user, isLoading } = useFullUser();

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

  const handleHover = (e: any, state: 'in' | 'out') => {
    const pressable = e.target;
    pressable.style.transition = 'all 0.4s ease-in-out';
    pressable.style.borderRadius = '10px';
    if (state === 'in') {
      pressable.style.backgroundColor = MAIN_COLOR_OPACITY;
    } else {
      pressable.style.backgroundColor = MAIN_COLOR;
    }
  }

  return (
    <Drawer
      screenOptions={{
        drawerType: isLG ? 'permanent' : 'slide',
        swipeEnabled: !isLG,
        overlayColor: 'transparent',
        drawerStyle: { backgroundColor: MAIN_COLOR },
        headerStyle: { backgroundColor: '#2F2766' },
        headerTintColor: 'white',
        headerLeft: isLG ? () => null : undefined,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CoinsDisplay coins={isLoading ? '...' : (user?.coins || 0)} />
            <RateAppModal />
          </View>
        ),
        headerRightContainerStyle: { paddingRight: 16 },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={{ justifyContent: 'space-between' }}
          style={styles.container}
        >
          {/* Profile */}
          <View style={styles.drawerNavbar}>
            <Text style={styles.nameTxt}>
              {isLoading ? '...' : `${user?.name ?? ''} ${user?.last_name ?? ''}`}
            </Text>
            <Text style={styles.emailTxt}>{isLoading ? '...' : user?.email}</Text>
            <Link style={styles.editTxt} href='/edit-account'>
              {t('update-account')}
            </Link>
          </View>

          {/* Drawer pressable items */}
          <View style={styles.itemsContainer}>
            <Pressable 
              onHoverIn={(e) => handleHover(e, 'in')} onHoverOut={(e) => handleHover(e, 'out')}
              onPress={() => router.push('/home')} 
              style={styles.shareBtn}
            >
              <Entypo name='home' size={isXXL ? 20 : 18} color='white' />
              <Text style={[styles.shareTxt, {fontSize: isXXL ? 21 : 19}]}>{t('home')}</Text>
            </Pressable>

            <Pressable 
              onHoverIn={(e) => handleHover(e, 'in')} onHoverOut={(e) => handleHover(e, 'out')}
              onPress={() => router.push('/select-league')} 
              style={styles.shareBtn}
            >
              <Entypo name='game-controller' size={isXXL ? 19 : 17} color='white' />
              <Text style={[styles.shareTxt, {fontSize: isXXL ? 21 : 19}]}>{t('leagues')}</Text>
            </Pressable>

            {Platform.OS === 'web' &&
              <Pressable 
                onHoverIn={(e) => handleHover(e, 'in')} onHoverOut={(e) => handleHover(e, 'out')}
                onPress={() => router.push('/prizes?backto=home')} 
                style={styles.shareBtn}
              >
                <FontAwesome name='gift' size={isXXL ? 19 : 17} color='white' />
                <Text style={[styles.shareTxt, {fontSize: isXXL ? 21 : 19}]}>
                  {toCapitalCase(t('prizes'))}
                </Text>
              </Pressable>
            }

            <Pressable 
              onHoverIn={(e) => handleHover(e, 'in')} onHoverOut={(e) => handleHover(e, 'out')}
              onPress={() => router.push(`/home/referrals?referralCode=${user.referral_code}`)} 
              style={styles.shareBtn}
            >
              <Entypo name='add-user' size={isXXL ? 19 : 17} color='white' />
              <Text style={[styles.shareTxt, {fontSize: isXXL ? 21 : 19}]}>{t('referrals')}</Text>
            </Pressable>

            <Pressable 
              onHoverIn={(e) => handleHover(e, 'in')} onHoverOut={(e) => handleHover(e, 'out')}
              onPress={() => router.push('/home/how-to-play')} 
              style={styles.shareBtn}
            >
              <Entypo name='help' size={isXXL ? 19 : 17} color='white' />
              <Text style={[styles.shareTxt, {fontSize: isXXL ? 21 : 19}]}>
                {t('how-to-play')}
              </Text>
            </Pressable>

            {Platform.OS === 'android' &&
              <Pressable 
                onHoverIn={(e) => handleHover(e, 'in')} onHoverOut={(e) => handleHover(e, 'out')}
                onPress={() => handleShare()} 
                style={styles.shareBtn}
              >
                <Entypo name='share' size={isXXL ? 19 : 17} color='white' />
                <Text style={[styles.shareTxt, {fontSize: isXXL ? 21 : 19}]}>
                  {t('share')}
                </Text>
              </Pressable>
            }

            <View style={styles.socialMediaContainer}>
              <Link href={INSTAGRAM_URL} style={styles.socialMediaBtn} target='_blank'>
                <Entypo name='instagram' size={isXXL ? 25 : 23} color='white' />
              </Link>
              <Link href={TWITTER_URL} style={styles.socialMediaBtn} target='_blank'>
                <Entypo name='twitter' size={isXXL ? 25 : 23} color='white' />
              </Link>
              <Link href={FACEBOOK_URL} style={styles.socialMediaBtn} target='_blank'>
                <Entypo name='facebook' size={isXXL ? 25 : 23} color='white' />
              </Link>
            </View>
          </View>

          {/* Logout */}
          <Pressable onPress={logOut} style={[styles.logoutBtn, {width: isSM ? '80%' : '60%'}]}>
            <Entypo name='log-out' size={isXXL ? 21 : 19} color='white' />
            <Text style={[styles.logoutTxt, {fontSize: isXXL ? 19 : 17}]}>{t('log-out')}</Text>
          </Pressable>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name='index'
        options={{
          title: t('home'),
        }}
      />
      <Drawer.Screen
        name='how-to-play'
        options={{
          title: t('how-to-play'),
        }}
      />
      <Drawer.Screen
        name='referrals'
        options={{
          title: t('referrals'),
        }}
      />
    </Drawer>
  );
}
