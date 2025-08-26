import { FlatList, ActivityIndicator } from 'react-native';
import { BetProps, CoinsPrizes } from '../types';
import RankedPlayer from './RankedPlayer';

interface Props {
  bets: BetProps[];
  coinsPrizes?: CoinsPrizes;
  onEnd: () => void;
  loadingMore: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function RankedPlayersFlatList({
  bets, coinsPrizes, onEnd, loadingMore, refreshing, onRefresh
}: Props) {
  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 70, flexGrow: 1 }}
      data={bets}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item, index }) => (
        <RankedPlayer
          key={item.id}
          index={index + 1}
          username={item.username}
          points={item.points}
          exactResults={item.exact_results}
          profileImageUrl={item.profile_image}
          coinPrizes={coinsPrizes}
        />
      )}
      onEndReachedThreshold={0.4}
      onEndReached={onEnd}
      ListFooterComponent={loadingMore ? <ActivityIndicator size='large' color='#ffffff' /> : null}
      refreshing={refreshing}
      onRefresh={onRefresh}
      removeClippedSubviews
      initialNumToRender={20}
      windowSize={7}
      showsVerticalScrollIndicator
    />
  );
}