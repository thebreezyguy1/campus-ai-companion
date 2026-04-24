import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const SLIDES = [
  {
    id: 1,
    tag: "Your AI advisor",
    title: "Meet your campus\ncompanion",
    desc: "Ask anything about KSU — course selection, deadlines, study strategies, campus resources. Get answers tailored to your major and year.",
    accent: "#4F46E5",
    bg: "#F5F4FF",
    iconBg: "#E0DEFF",
    icon: (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
        }}
      >
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: "#4F46E5",
            marginBottom: 4,
          }}
        />
        <View style={{ flexDirection: "row", gap: 4 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: "#A5B4FC",
            }}
          />
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 3,
              backgroundColor: "#A5B4FC",
            }}
          />
        </View>
      </View>
    ),
  },
  {
    id: 2,
    img_url: "",
    tag: "Smart course planning",
    title: "Know exactly\nwhat's next",
    desc: "Tell us which courses you've completed and your AI companion maps out your remaining path — semester by semester — to graduation.",
    accent: "#0EA5E9",
    bg: "#F0F9FF",
    iconBg: "#BAE6FD",
    icon: (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
        }}
      >
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 44 - i * 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === 0 ? "#0EA5E9" : "#BAE6FD",
              marginBottom: 4,
            }}
          />
        ))}
      </View>
    ),
  },
  {
    id: 3,
    tag: "Always with you",
    title: "Study smarter,\nnot harder",
    desc: "Get quiz-ready with AI-powered study mode, track your conversations, and receive smart reminders — all personalized to your KSU schedule.",
    accent: "#10B981",
    bg: "#F0FDF9",
    iconBg: "#A7F3D0",
    icon: (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 4,
            borderColor: "#10B981",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: "#10B981",
            }}
          />
        </View>
      </View>
    ),
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flatListRef] = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem("onboarding_complete", true);
    navigation.replace("Login");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("onboarding_complete", true);
    navigation.replace("Login");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const slide = SLIDES[currentIndex];

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <FlatList
          data={ONBOARDING_DATA}
          renderItem={({ item }) => (
            <Slide
              imgURL={item.img_url}
              title={item.title}
              tag={item.tag}
              desc={item.desc}
            />
          )}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={setCurrentIndex(currentIndex + 1)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
