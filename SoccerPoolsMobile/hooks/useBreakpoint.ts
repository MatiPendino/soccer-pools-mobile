import { useWindowDimensions } from 'react-native';
import { breakpoints } from '../constants';

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const isSM = width < breakpoints.sm;
  const isMD = width >= breakpoints.sm && width < breakpoints.md;
  const isLG = width >= breakpoints.md;
  const isXL = width >= breakpoints.lg;

  return { width, height, isSM, isMD, isLG, isXL };
}