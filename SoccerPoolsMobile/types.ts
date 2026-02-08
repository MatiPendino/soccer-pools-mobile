export type Slug = string;
export type ISO8601DateString = string;
export type Email = string;

export interface CoinsPrizes {
    coins_prize_first: number;
    coins_prize_second: number;
    coins_prize_third: number;
};

export interface TeamProps {
    name: string;
    acronym: string;
    badge: string;
    slug: Slug;
};

export interface UserProps {
    id: number;
    name: string;
    last_name: string;
    email: Email;
    username: string;
    profile_image: string;
    coins: number;
};

export interface UserEditableProps {
    email: Email;
    name: string;
    last_name: string;
    profile_image?: string;
    username: string;
    instagram_username?: string;
    twitter_username?: string;
};

export interface UserCoinsProps {
    id: number;
    coins: number;
};

export interface UserMemberProps {
    profile_image: string;
    username: string;
    created_at: string;
};

export interface MatchProps {
    id: number;
    team_1: TeamProps;
    team_2: TeamProps;
    round: RoundProps;
    start_date: ISO8601DateString;
    match_state: number;
};

export interface MatchResultProps {
    id: number;
    goals_team_1: number;
    goals_team_2: number;
    match: MatchProps;
    points: number;
};

export interface LeagueProps {
    id: number;
    logo: string;
    name: string;
    slug: Slug;
    continent: number;
    is_user_joined: Boolean;
    coins_cost: number;
    coins_prizes: CoinsPrizes;
};

export interface RoundProps {
    end_date: ISO8601DateString;
    id: number;
    league: LeagueProps;
    name: string;
    number_round: number;
    round_state: number;
    slug: Slug;
    start_date: ISO8601DateString;
    has_bet_round: Boolean;
    coins_prizes: CoinsPrizes;
};

export interface RoundsStateProps {
    [key: Slug]: boolean;
}

export interface BetProps {
    id: number;
    username: string;
    profile_image: string;
    round_id: number;
    points: number;
    exact_results: number;
    operation_code: string;
};

export interface TournamentProps {
    id: number;
    name: string;
    description: string;
    logo: string;
    league: LeagueProps;
    admin_tournament: UserProps;
    n_participants: number;
    is_current_user_admin: boolean;
};

export interface TournamentUserProps {
    id: number;
    tournament: TournamentProps;
    user: UserProps;
    tournament_user_state: 0 | 1 | 2 | 3;
};

export interface PrizeProps {
    id: number;
    title: string;
    image?: string;
    description?: string;
    coins_cost: number;
};

export interface ContinentProps {
    id: number;
    name: string;
};

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';

export type PaymentType = 'round' | 'league';

export interface PaidLeagueConfigProps {
    id: number;
    league: {
        id: number;
        name: string;
        slug: Slug;
        logo: string;
    };
    is_paid_mode_enabled: boolean;
    round_price_ars: string;
    league_price_ars: string;
    start_round_number: number;
};

export interface PaymentProps {
    id: number;
    payment_type: PaymentType;
    status: PaymentStatus;
    gross_amount_ars: string;
    league_name: string;
    round_name: string | null;
    external_reference: string;
    creation_date: ISO8601DateString;
};

export interface PaymentPreferenceProps {
    payment_id: number;
    external_reference: string;
    init_point: string;
    sandbox_init_point?: string;
    amount: string;
    rounds_count?: number;
};

export interface PaidMatchResultProps {
    id: number;
    match_id: number;
    team_1_name: string;
    team_2_name: string;
    team_1_badge_url: string;
    team_2_badge_url: string;
    goals_team_1: number | null;
    goals_team_2: number | null;
    points: number;
    is_exact: boolean;
    match_start_date: ISO8601DateString;
};

export interface PaidBetRoundProps {
    id: number;
    username: string;
    profile_image: string;
    points: number;
    exact_results: number;
    round_id: number;
    round_name: string;
    winner_first: boolean;
    winner_second: boolean;
    winner_third: boolean;
    paid_match_results?: PaidMatchResultProps[];
};

export interface PaidPrizePoolProps {
    id: number;
    league_name: string;
    round_name: string | null;
    is_league_pool: boolean;
    total_pool_ars: string;
    distributed: boolean;
    participants_count?: number;
};

export interface PaidLeaderboardEntryProps {
    rank: number;
    username: string;
    profile_image: string | null;
    points: number;
    exact_results: number;
    winner_first: boolean;
    winner_second: boolean;
    winner_third: boolean;
};