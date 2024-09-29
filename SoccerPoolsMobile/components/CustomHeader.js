import { View, Text, StyleSheet } from 'react-native';
//import { StatusBar } from 'react-native';

export default function CustomHeader({ hasBackOption }) {
  return (
    <View style={styles.header}>
      {/*<StatusBar backgroundColor="#2F2766" barStyle="light-content" />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  /*header: {
    backgroundColor: '#2F2766',
    paddingTop: StatusBar.currentHeight || 20,
    paddingBottom: 15,
    alignItems: 'center',
  },*/
});