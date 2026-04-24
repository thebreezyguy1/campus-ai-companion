import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "has_seen_onboarding";

export const hasSeenOnboarding = async () => {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value !== null;
};

export const markOnboardingComplete = async () => {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
};
