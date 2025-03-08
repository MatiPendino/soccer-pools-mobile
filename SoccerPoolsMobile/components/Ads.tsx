import { useEffect } from 'react';
import { BannerAd, TestIds, BannerAdSize, AdEventType, InterstitialAd, AppOpenAd } from 'react-native-google-mobile-ads';

export const Banner = ({bannerId}: {bannerId: string}) => {
    const adUnitIdBanner: string = Boolean(Number(process.env.TEST_ADS)) ? TestIds.BANNER : bannerId

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
    const adUnitIdInterst: string = Boolean(Number(process.env.TEST_ADS)) ? TestIds.INTERSTITIAL : interstitialId
    const interstitial = InterstitialAd.createForAdRequest(adUnitIdInterst);

    useEffect(() => {
        const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
            showAd()
        });
          
        interstitial.load();
          
        return unsubscribe;
    }, []);
            
    const showAd = () => {
        interstitial.show();
    };
}
  
export const showOpenAppAd = async (openAppId): Promise<void> => {
    const openAdUnitId: string = Boolean(Number(process.env.TEST_ADS)) ? TestIds.APP_OPEN : openAppId
    const openApp = AppOpenAd.createForAdRequest(openAdUnitId, {
        requestNonPersonalizedAdsOnly: true,
    });

    return new Promise((resolve, reject) => {
        openApp.load();
    
        //const eventListener = openApp.addAdEventListener(AdEventType.LOADED, () => {
        openApp.addAdEventListener(AdEventType.LOADED, () => {
            openApp.show();
            resolve();
        });
    
        openApp.addAdEventListener(AdEventType.ERROR, (error) => {
            console.log('Open App Ad Error:', error);
            reject(error);
        })
    })
}