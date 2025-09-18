export const MAIN_COLOR: string = '#6860A1'
export const MAIN_COLOR_OPACITY: string = 'rgba(139, 130, 218, 1)';
export const GOLD_COLOR: string = '#FFD700'
export const SILVER_COLOR: string = '#C0C0C0'
export const BRONZE_COLOR: string = '#CD7F32'
export const DARK_PURPLE_COLOR: string = '#25223b'
export const PURPLE_COLOR: string = '#362B6F'
export const REVIEW_APP_COINS_PRIZE: number = 2000
export const ANDROID_URL: string= 'https://play.google.com/store/apps/details?id=com.matipendino2001.soccerpools'
export const PORTFOLIO_URL: string = 'https://matiaspendino.com'
export const TWITTER_URL: string = 'https://x.com/prode_app'
export const INSTAGRAM_URL: string = 'https://www.instagram.com/tuprodeapp/'
export const FACEBOOK_URL: string = 'https://www.facebook.com/people/Tu-Prode-Penca-F%C3%BAtbol/61573988720647/'
export const breakpoints = { sm: 550, md: 768, lg: 1024, xl: 1280, xxl: 1550 }

export const REWARD_AD_REWARD = 0
export const REWARD_APP_REVIEW = 1
export const REWARD_DAILY = 2
export const REWARD_REFERRAL = 3
export const REWARD_LEAGUE_WINNER = 4

export const getHowItWorks = (t) => {
    return [
        {
            id: 1,
            icon: require('./assets/img/cup.png'),
            title: t('hiw-1-title'),
            text: t('hiw-1-description'),
        },
        {
            id: 2,
            icon: require('./assets/img/predict.png'),
            title: t('hiw-2-title'),
            text: t('hiw-2-description'),
        },
        {
            id: 3,
            icon: require('./assets/img/sum-points.png'),
            title: t('hiw-3-title'),
            text: t('hiw-3-description'),
        },
        {
            id: 4,
            icon: require('./assets/img/leagues_world.png'),
            title: t('hiw-4-title'),
            text: t('hiw-4-description'),
        },
        {
            id: 5,
            icon: require('./assets/img/tournaments.png'),
            title: t('hiw-5-title'),
            text: t('hiw-5-description'),
        },
    ];
} 