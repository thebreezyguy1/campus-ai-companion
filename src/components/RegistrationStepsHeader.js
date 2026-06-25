import { StyleSheet, Text, View } from "react-native";

export default function RegistrationStepsHeader({ activeIndex }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        gap: 10,
      }}
    >
      <View style={styles.circleContainer}>
        <View
          style={[
            styles.circle,
            1 < activeIndex ? styles.previousCircle : null,
            activeIndex === 1 ? styles.activeCircle : null,
          ]}
        ></View>
        <View
          style={[
            styles.circle,
            2 < activeIndex ? styles.previousCircle : null,
            activeIndex === 2 ? styles.activeCircle : null,
          ]}
        ></View>
        <View
          style={[
            styles.circle,
            activeIndex === 3 ? styles.activeCircle : null,
          ]}
        ></View>
      </View>
      <Text style={styles.subtitle}>Step {activeIndex} of 3</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circleContainer: {
    flexDirection: "row",
    width: "auto",
    height: 10,
    gap: 8,
  },
  circle: {
    width: 10,
    borderRadius: 50,
    backgroundColor: "#BEBEBD",
  },
  activeCircle: {
    backgroundColor: "#4F46E4",
    width: 30,
  },
  previousCircle: {
    backgroundColor: "#4F46E4",
  },
});
