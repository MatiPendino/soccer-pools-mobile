import { useEffect, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Router, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import { prizeClaim, prizesList } from 'services/prizeService';
import { PrizeProps, UserCoinsProps } from 'types';
import handleError from 'utils/handleError';
import { getToken } from 'utils/storeToken';
import PrizeCard from './components/prize-card/PrizeCard';
import { useBreakpoint } from 'hooks/useBreakpoint';
import Footer from 'components/footer/Footer';
import CoinsDisplay from 'components/CoinsDisplay';
import { MAIN_COLOR } from '../../constants';
import { userCoinsRetrieve } from 'services/userService';
import { toCapitalCase } from 'utils/helper';


export default function Prizes () {
    const [prizes, setPrizes] = useState<PrizeProps[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [loadingCoins, setLoadingCoins] = useState<boolean>(true);
    const [isClaiming, setIsClaiming] = useState<boolean>(false);
    const [user, setUser] = useState<UserCoinsProps | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const toast: ToastType = useToast();
    const router: Router = useRouter();
    const { t } = useTranslation();
    const { backto } = useLocalSearchParams();

    const { isLG } = useBreakpoint();

    useEffect(() => {
        const getPrizes = async () => {
            try {
                const token = await getToken();
                setToken(token);
                if (token) {
                    try {
                        const user: UserCoinsProps = await userCoinsRetrieve(token);
                        setUser(user);    
                    } catch (error) {
                        toast.show(handleError(error), {type: 'danger'});
                    } finally {
                        setLoadingCoins(false);
                    }
                }
                const prizes = await prizesList();
                setPrizes(prizes);
            } catch (error) {
                toast.show(handleError(error), {type: 'danger'});
            } finally {
                setIsLoading(false);
            }
            
        }

        getPrizes();
    }, [])

    const onClaim = async (prizeId) => {
        setIsClaiming(true);
        try {
            if (token) {
                await prizeClaim(token, prizeId);
                toast.show(t('prize-claimed-successfully'), {type: 'success'});
            } else {
                router.push('login');
            }
        } catch (error) {
            toast.show(handleError(error), {type: 'danger'});
        } finally {
            setIsClaiming(false);
        }
    }

    const setUserCoins = (coins: number) => {
        setUser({...user, coins: coins});
    }

    
    return (
        <ScrollView style={styles.screen}>
            <View style={styles.headerContainer}>
                <Link href={backto === 'home' ? '/home' : '/'} style={styles.arrowLink}>
                    <Entypo name='chevron-left' color='white' size={30} />
                </Link>
                <Text style={styles.header}>{toCapitalCase(t('prizes'))}</Text>
                <Text style={styles.subtitle}>{t('claim-rewards')}</Text>
                {token && !isLoading &&
                    <View style={styles.coinsContainer}>
                        <CoinsDisplay setCoins={setUserCoins} coins={loadingCoins ? '...' : (user.coins || 0)} />
                    </View>
                }
                
            </View>

            <Text style={[styles.description, {fontSize: isLG ? 17 : 15, marginHorizontal: isLG ? 50 : 25}]}>
                {t('all-prizes-free')}
            </Text>

            <View>
                {
                    isLoading
                    ?
                    <ActivityIndicator size='large' color='#007AFF' />
                    :
                    <FlatList
                        data={prizes}
                        renderItem={({ item }) => (
                            <PrizeCard key={item.id}
                                prize={item}
                                onClaim={onClaim}
                                isClaiming={isClaiming}
                            />
                        )}
                        numColumns={isLG ? 3 : 2}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        columnWrapperStyle={styles.columnWrapper}
                    />
                }
            </View>

            {Platform.OS === 'web' && <Footer />} 
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f7fbff', 
    position: 'relative',
  },
  headerContainer: {
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
  },
  arrowLink: {
    position: 'absolute',
    left: 15,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 19,
    color: '#E3ECFF',
    marginTop: 4,
  },
  coinsContainer: {
    position: 'absolute',
    right: 15,
  },
  description: {
    color: '#444444',
    marginTop: 20,
    marginBottom: 25,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});