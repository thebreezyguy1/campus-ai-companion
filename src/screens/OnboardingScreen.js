import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

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
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem("has_seen_onboarding", "true");
    navigation.replace("Login");
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("has_seen_onboarding", "true");
    navigation.replace("Login");
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const slide = SLIDES[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: slide.bg }]}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={[styles.logoBox, { backgroundColor: "#FFCC00" }]}>
            <Text style={styles.logoText}>KSU</Text>
          </View>
          <Text style={styles.logoLabel}>Campus AI</Text>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View
              style={[
                styles.illustrationArea,
                { backgroundColor: item.iconBg },
              ]}
            >
              <View style={styles.illustrationInner}>
                {item.icon}
                <View
                  style={[styles.glowDot, { backgroundColor: item.accent }]}
                />
              </View>
            </View>

            <View style={styles.textArea}>
              <View style={[styles.tag, { backgroundColor: item.iconBg }]}>
                <Text style={[styles.tagText, { color: item.accent }]}>
                  {item.tag}
                </Text>
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.desc}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.bottomArea}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor: slide.accent },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slide.accent }]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 8,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  logoLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  skipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  slide: {
    width,
    flex: 1,
    paddingHorizontal: 24,
  },
  illustrationArea: {
    height: height * 0.36,
    borderRadius: 24,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  illustrationInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    bottom: -20,
    right: -20,
    opacity: 0.4,
  },
  textArea: {
    marginTop: 32,
    gap: 12,
  },
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 23,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 20,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: "#fff",
    fontSize: 14,
  },
});
