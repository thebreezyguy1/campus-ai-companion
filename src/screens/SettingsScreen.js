import { View, Text, Button } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to Campus AI Companion</Text>
      <Button title="Get Started" onPress={() => navigation.replace('Login')} />
    </View>
  );
}