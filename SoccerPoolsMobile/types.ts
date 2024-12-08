export type Slug = string
export type ISO8601DateString = string
export type Email = string

export interface MatchResultProps {
    badge_team_1: string
    badge_team_2: string
    goals_team_1: number
    goals_team_2: number
    id: number
    team_1: string
    team_2: string
}

export interface LeagueProps {
    id: number
    logo: string
    name: string
    slug: Slug
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
}

export interface RoundsStateProps {
    [key: Slug]: boolean
}