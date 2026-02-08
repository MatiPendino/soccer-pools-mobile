import { FlatList, ActivityIndicator } from 'react-native';
import { BetProps, CoinsPrizes, PaidLeaderboardEntryProps } from '../types';
import { colors } from '../theme';
import RankedPlayer from './RankedPlayer';

type LeaderboardEntry = BetProps | PaidLeaderboardEntryProps;

interface Props {
  bets: BetProps[] | PaidLeaderboardEntryProps[];
  coinsPrizes?: CoinsPrizes | null;
  onEnd: () => void;
  loadingMore: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  isPaidMode?: boolean;
  prizePoolTotal?: string | null;
}

export default function RankedPlayersFlatList({
  bets, coinsPrizes, onEnd, loadingMore, refreshing, onRefresh,
  isPaidMode=false, prizePoolTotal=null
}: Props) {
  return (
    <FlatList<LeaderboardEntry>
      contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
      data={bets as LeaderboardEntry[]}
      keyExtractor={(item) => {
        if ('id' in item) {
          return String(item.id);
        } else {
          return String(item.rank);
        }
      }}
      renderItem={({ item, index }) => {
        const key = 'id' in item ? item.id : item.rank;
        return (
          <RankedPlayer
            key={key}
            index={index + 1}
            username={item.username}
            points={item.points}
            exactResults={item.exact_results}
            profileImageUrl={item.profile_image}
            coinPrizes={coinsPrizes}
            isPaidMode={isPaidMode}
            prizePoolTotal={prizePoolTotal}
          />
        );
      }}
      onEndReachedThreshold={0.4}
      onEndReached={onEnd}
      ListFooterComponent={
        loadingMore ?
        <ActivityIndicator size='large' color={isPaidMode ? colors.coins : '#ffffff'} /> :
        null
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
      removeClippedSubviews
      initialNumToRender={20}
      windowSize={7}
      showsVerticalScrollIndicator
    />
  );
}