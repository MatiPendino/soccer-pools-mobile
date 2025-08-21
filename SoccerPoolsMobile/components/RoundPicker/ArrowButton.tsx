import { Pressable, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MAIN_COLOR } from '../../constants';


interface Props {
  direction: 'left' | 'right';
  disabled?: boolean;
  onPress: () => void;
}

export default function ArrowButton({ direction, disabled, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.arrowBtn, disabled && styles.arrowDisabled]}
      hitSlop={10}
    >
      <Entypo name={`chevron-${direction}`} color='white' size={25} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MAIN_COLOR,
    elevation: 2,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  arrowDisabled: { opacity: 0.35 },
});
