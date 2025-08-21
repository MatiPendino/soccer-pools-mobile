import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { MAIN_COLOR } from "../../../constants";
import { RoundProps, RoundsStateProps, BetProps, Slug, LeagueProps, CoinsPrizes } from "../../../types";
import { getToken } from "../../../utils/storeToken";
import RankedPlayersFlatList from "../../../components/RankedPlayersFlatList";
import { getBetLeaders, getRounds, getRoundsState, swapRoundsBetLeaders } from "../../../utils/leagueRounds";
import RoundsPicker from 'components/RoundPicker';
import { userLeague } from "../../../services/leagueService";
import { Banner, interstitial } from "components/ads/Ads";
import LoadingCards from "../../../components/LoadingCards";
import { getWrapper } from "../../../utils/getWrapper";

export default function Leaderboard ({}) {
    const [rounds, setRounds] = useState<RoundProps[]>([])
    const [roundsState, setRoundsState] = useState<RoundsStateProps>({})
    const [bets, setBets] = useState<BetProps[]>([])
    const [coinsPrizes, setCoinsPrizes] = useState<CoinsPrizes>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const toast = useToast()

    const swapRoundBetLeaders = async (roundId: number, roundSlug: Slug) => {
        try {
            const {betLeaders, newRoundsState} = await swapRoundsBetLeaders(
                roundSlug, 0, roundsState
            )
            setBets(betLeaders)
            const currentRound = rounds.find(round => round.id === roundId)
            setCoinsPrizes(currentRound.coins_prizes)
            setRoundsState(newRoundsState)
        } catch (error) {
            toast.show('There`s been an error displaying the bets', {type: 'danger'})
        }
    }

    useEffect(() => {
        const getLeague = async (): Promise<void> => {
            try {
                const token: string = await getToken()
                const temp_league: LeagueProps = await userLeague(token)
                const roundsByLeague = await getRounds(token, temp_league.id)
                setRounds(roundsByLeague)
                setRoundsState(getRoundsState(roundsByLeague))
                setCoinsPrizes(roundsByLeague[0].coins_prizes)
                getFirstBetLeaders(token, roundsByLeague[0].slug)
            } catch (error) {
                toast.show('There is been an error displaying league information', {type: 'danger'})
            } 
        }

        const getFirstBetLeaders = async (token, firstRoundSlug): Promise<void> => {
            try {
                const betLeaders = await getBetLeaders(token, firstRoundSlug, 0)  
                setBets(betLeaders)
            } catch (error) {
                toast.show('There´s been an error getting the matches', {type: 'danger'})
            } finally {
                setIsLoading(false)
            }
        }
        
        getLeague()
    }, [])

    //interstitial(process.env.LEADERBOARD_INTERST_ID)
    const Wrapper = getWrapper();

    return (
        <Wrapper style={styles.container}>
            {
                isLoading
                ?
                <ShimmerPlaceholder style={styles.roundsListLoading} />
                :
                <RoundsPicker
                    rounds={rounds}
                    handleRoundSwap={swapRoundBetLeaders}
                    roundsState={roundsState}
                />
            }
                                    
            {
                isLoading
                ?
                <LoadingCards cardHeight={80} nCards={5} cardColor='#d9d9d9' />
                :
                <RankedPlayersFlatList bets={bets} coinsPrizes={coinsPrizes} />
            }
            <Banner bannerId={process.env.LEADERBOARD_BANNER_ID} />
        </Wrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: MAIN_COLOR,
        flex: 1,
        
    },
    roundsListLoading: { 
        width: "100%", 
        height: 50, 
        marginBottom: 30 
    },
    leaguesContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 7,
        backgroundColor: '#d9d9d9',
        height: 50,
        marginBottom: 15
    },
    roundBtn: {
        marginHorizontal: 15,
        marginVertical: 0
    },
    roundTxt: {
        fontWeight: '700',
        fontSize: 17
    },
    activeRoundBtn: {
        borderBottomColor: MAIN_COLOR,
        borderBottomWidth: 5,
    },
    activeRoundTxt: {
        color: MAIN_COLOR
    },
    betResultsContainer: {
        paddingBottom: 70,
        flexGrow: 1
    },
})