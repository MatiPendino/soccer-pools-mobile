import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  BannerAd, TestIds, BannerAdSize, AdEventType, InterstitialAd, AppOpenAd, 
  RewardedAd, RewardedAdEventType
} from 'react-native-google-mobile-ads';

export const Banner = ({bannerId}: {bannerId: string}) => {
    const adUnitIdBanner: string = Boolean(Number(process.env.TEST_ADS)) ? TestIds.BANNER : bannerId;

    return (
        <BannerAd
            unitId={adUnitIdBanner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
                requestNonPersonalizedAdsOnly: true,
            }}
            onAdFailedToLoad={(error) => {
                console.error('Ad failed to load: ', error);
            }}
      />
    )
}

export const interstitial = (interstitialId: string) => {
    const adUnitIdInterst: string = Boolean(Number(process.env.TEST_ADS)) ? TestIds.INTERSTITIAL : interstitialId;
    const interstitial = InterstitialAd.createForAdRequest(adUnitIdInterst);

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            showAd();
        });
          
        interstitial.load();
          
        return unsubscribe;
    }, []);
            
    const showAd = () => {
        interstitial.show();
    };
}
  
export const showOpenAppAd = async (openAppId): Promise<void> => {
    const openAdUnitId: string = Boolean(Number(process.env.TEST_ADS)) ? TestIds.APP_OPEN : openAppId;
    const openApp = AppOpenAd.createForAdRequest(openAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    return new Promise((resolve, reject) => {
        openApp.load();
    
        openApp.addAdEventListener(AdEventType.LOADED, () => {
            openApp.show();
            resolve();
        });
    
        openApp.addAdEventListener(AdEventType.ERROR, (error) => {
            reject(error);
        });
    });
}


interface UseRewardedAdOptions {
  onEarnedReward: (amount: number, type: string) => void;
}

export function useRewardedAd({onEarnedReward}: UseRewardedAdOptions) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const adUnitIdRewarded: string = 
    Boolean(Number(process.env.TEST_ADS)) ? TestIds.REWARDED
    : process.env.REWARDED_AD_ID;

  // Create the ad instance exactly once
  const rewardedAdRef = useRef(
    RewardedAd.createForAdRequest(adUnitIdRewarded, {
      requestNonPersonalizedAdsOnly: true,
    })
  );
  const rewardedAd = rewardedAdRef.current;

  useEffect(() => {
    const subs = [
      rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setLoaded(true);
      }),
      rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('RewardedAd failed to load/show:', error);
      }),
      rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, ({ amount, type }) => {
        onEarnedReward(amount, type);
      }),
      rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        setLoaded(false);
        rewardedAd.load();
      }),
    ];

    // kick off initial load
    rewardedAd.load();

    return () => subs.forEach(unsub => unsub());
  }, [onEarnedReward, rewardedAd]);

  const show = useCallback(() => {
    if (loaded) {
      rewardedAd.show();
      setLoaded(false);
    } else {
      console.log('Rewarded ad not loaded yet.');
    }
  }, [loaded])

  return { loaded, show };
}
