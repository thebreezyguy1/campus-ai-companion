import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function EditProfileScreen({ navigation }) {
  const profileImg = null;

  const [saving, setSaving] = useState(false);
  const handleSave = () => {};

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.mainContainer}
    >
      <View style={styles.header}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Edit Profile</Text>
      </View>
      <View style={styles.innerContainer}>
        <View></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
    flex: 1,
  },
  mainContainer: {
    paddingTop: 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  navigationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  backArrow: {
    fontSize: 20,
    fontWeight: 500,
  },
  saveText: {
    fontSize: 20,
    color: "#4F46E4",
  },
  title: {
    fontSize: 30,
    fontWeight: 500,
  },
  innerContainer: {
    padding: 20,
    flex: 1,
  },
});
