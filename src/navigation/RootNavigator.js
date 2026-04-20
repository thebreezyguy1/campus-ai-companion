import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from '../hooks/useAuth';
import AppTabs from './AppTabs';
import AuthStack from './AuthStack';
import { ActivityIndicator, View } from "react-native";
import { useEffect, useState } from "react";
import { hasSeenOnboarding } from "../services/storageService";
import SplashScreen from "../screens/SplashScreen";

export default function RootNavigator() {
    const [onboardingDone, setOnboardingDone] = useState(false);
    const [checkingStorage, setCheckingStorage] = useState(true);

    const {user, loading} = useAuth();

    useEffect(() => {
        hasSeenOnboarding().then(seen => {
            setOnboardingDone(seen);
            setCheckingStorage(false);
        });
    }, []);

    if (checkingStorage || loading) return <SplashScreen />

    return (
        <NavigationContainer>
            {user ? <AppTabs /> : <AuthStack initalRoute={onboardingDone ? 'Login': 'Onboarding'} />}
        </NavigationContainer>
    )
}