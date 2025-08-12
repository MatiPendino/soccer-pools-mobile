import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Router, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MAIN_COLOR } from '../constants';

export default function NotFoundScreen({}) {
    const router: Router = useRouter();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/icon-no-bg.png')}
                style={styles.image}
            />
            <Text style={styles.title}>404</Text>
            <Text style={styles.subtitle}>Oops! Page Not Found</Text>
            <Text style={styles.description}>
                Looks like you kicked the ball out of the stadium! 🏟️
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.replace('/')}
            >
                <Text style={styles.buttonText}>Go Back Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MAIN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 5,
    color: '#ddd',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    color: '#EEE',
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: MAIN_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
});
