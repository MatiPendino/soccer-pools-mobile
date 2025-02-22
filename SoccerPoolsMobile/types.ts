export type Slug = string
export type ISO8601DateString = string
export type Email = string

export interface TeamProps {
    name: string
    acronym: string
    badge: string
    slug: Slug
}

export interface UserProps {
    id: number
    name: string
    last_name: string
    email: Email
    username: string
    profile_image: string
}

export interface MatchProps {
    id: number
    team_1: TeamProps
    team_2: TeamProps
    round: RoundProps
    start_date: ISO8601DateString
    match_state: number
}

export interface MatchResultProps {
    id: number
    goals_team_1: number
    goals_team_2: number
    match: MatchProps
    points: number
}

export interface LeagueProps {
    id: number
    logo: string
    name: string
    slug: Slug
    is_user_joined: Boolean
}

export interface RoundProps {
    end_date: ISO8601DateString,
    id: number,
    league: LeagueProps
    name: string
    number_round: number
    round_state: number
    slug: Slug
    start_date: ISO8601DateString
    has_bet_round: Boolean
}

export interface RoundsStateProps {
    [key: Slug]: boolean
}

export interface BetProps {
    id: number
    username: string
    profile_image: string
    round_id: number
    points: number
    operation_code: string
}

export interface TournamentProps {
    id: number
    name: string
    description: string
    logo: string
    league: LeagueProps
    admin_tournament: UserProps
    n_participants: number
}

export interface TournamentUserProps {
    id: number
    tournament: TournamentProps,
    user: UserProps,
    tournament_user_state: 0 | 1 | 2 | 3
}