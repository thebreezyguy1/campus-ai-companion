import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import Feather from "@expo/vector-icons/Feather";

export default function EditProfileScreen({ navigation }) {
  const { profile } = useUser();
  const profileImg = null;

  const getInitials = () => {
    return profile.firstName.charAt(0) + profile.lastName.charAt(0);
  };

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
        <View style={styles.imgContainer}>
          {profileImg ? (
            <View></View>
          ) : (
            <View>
              <View style={styles.initialsContainer}>
                <Text style={styles.initials}>{getInitials()}</Text>
              </View>
              <TouchableOpacity style={styles.cameraContainer}>
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.changePhotoText}>Change photo</Text>
        </View>
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
  imgContainer: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#4F46E4",
    fontSize: 30,
    fontWeight: 500,
  },
  initialsContainer: {
    backgroundColor: "#EEF2FF",
    padding: 30,
    borderRadius: 50,
  },
  cameraContainer: {
    backgroundColor: "#4F46E4",
    padding: 7,
    borderRadius: 50,
    position: "absolute",
    bottom: -10,
    right: 0,
    borderWidth: 4,
    borderColor: "#fff",
  },
  changePhotoText: {
    marginVertical: 15,
    fontSize: 17,
    color: "#4F46E4",
  },
});
