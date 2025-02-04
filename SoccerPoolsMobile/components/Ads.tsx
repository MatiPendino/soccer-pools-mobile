import { useEffect } from 'react';
import { BannerAd, TestIds, BannerAdSize, AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

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