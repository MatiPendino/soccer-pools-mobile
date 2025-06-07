declare module 'components/ads/Ads' {
  export const Banner: React.ComponentType<{ bannerId: string }>;
  export function interstitial(id: string): void;
  export function showOpenAppAd(id: string): Promise<void>;
  export function useRewardedAd(opts: {
    onEarnedReward: (amount: number, type: string) => void;
  }): { loaded: boolean; show: () => void };
}

declare module 'utils/initialize_mobile_ads/initializeMobileAds' {
  export default function initializeMobileAds(): void;
}

declare module 'utils/initialize_vexo/initializeVexo' {
  export default function initializeVexo(): void;
}

declare module 'utils/analytics/initializeAnalytics' {
  export default function initializeAnalytics(): void;
}
