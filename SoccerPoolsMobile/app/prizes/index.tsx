import { FlatList, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, Router, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import { ToastType, useToast } from 'react-native-toast-notifications';
import { useTranslation } from 'react-i18next';
import handleError from 'utils/handleError';
import { useBreakpoint } from 'hooks/useBreakpoint';
import Footer from 'components/footer/Footer';
import CoinsDisplay from 'components/CoinsDisplay';
import { toCapitalCase } from 'utils/helper';
import { MAIN_COLOR } from '../../constants';
import { usePrizes, useClaimPrize } from '../../hooks/usePrizes';
import { useUserCoins } from '../../hooks/useUser';
import PrizeCard from './components/prize-card/PrizeCard';

export default function Prizes() {
    const toast: ToastType = useToast();
    const router: Router = useRouter();
    const { t } = useTranslation();
    const { backto, referralCode } = useLocalSearchParams();
    const { isLG } = useBreakpoint();

    const { data: prizes, isLoading: isPrizesLoading } = usePrizes();
    const { data: userCoins, isLoading: isCoinsLoading } = useUserCoins();
    const { mutate: claimPrize, isPending: isClaiming } = useClaimPrize();

    const onClaim = (prizeId) => {
        if (!userCoins) {
            router.push('login');
            return;
        }

        claimPrize(prizeId, {
            onSuccess: () => {
                toast.show(t('prize-claimed-successfully'), { type: 'success' });
            },
            onError: (error) => {
                toast.show(handleError(error.message), { type: 'danger' });
            }
        });
    }

    
    return (
        <ScrollView style={styles.screen}>
            <View style={styles.headerContainer}>
                <Link 
                    href={
                        backto === 'home' 
                        ? 
                        '/home' 
                        : 
                        `/?referralCode=${referralCode ? referralCode : ''}`
                    }
                    style={styles.arrowLink}
                >
                    <Entypo name='chevron-left' color='white' size={30} />
                </Link>
                <Text style={[styles.headerTitle, isLG && styles.headerTitleLG]}>
                    {toCapitalCase(t('prizes'))}
                </Text>
                
                <Text style={styles.subtitle}>{t('claim-rewards')}</Text>
                {!isCoinsLoading && userCoins &&
                    <View style={styles.coinsContainer}>
                        <CoinsDisplay coins={userCoins.coins || 0} />
                    </View>
                }
                
            </View>

            <Text style={[
                styles.description, {fontSize: isLG ? 17 : 15, marginHorizontal: isLG ? 50 : 25}
            ]}>
                {t('all-prizes-free')}
            </Text>

            <View>
                {
                    isPrizesLoading
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerTitleLG: {
    fontSize: 36,
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