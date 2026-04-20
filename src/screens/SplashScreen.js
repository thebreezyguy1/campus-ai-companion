import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>AI</Text>
        </View>
      </View>
      <Text style={styles.title}>Campus AI Companion</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Kennesaw State University</Text>
      </View>
      <ActivityIndicator color="#FFCC00" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  logoBox: {
    marginBottom: 4,
  },
  iconBox: {
    width: 72,
    height: 72,
    backgroundColor: '#FFCC00',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#FFCC00',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  spinner: {
    marginTop: 32,
  },
});