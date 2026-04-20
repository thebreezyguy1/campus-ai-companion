import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SchoolInfoScreen from '../screens/SchoolInfoScreen';
import ProgramInfoScreen from '../screens/ProgramInfoScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack({ initialRoute = 'Onboarding' }) {
    return (
        <Stack.Navigator 
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="SchoolInfo" component={SchoolInfoScreen} />
            <Stack.Screen name="ProgramInfo" component={ProgramInfoScreen} />
        </Stack.Navigator>
    )
}