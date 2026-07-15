import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getUserData, logout } from "../services/authService";
import SplashScreen from "./SplashScreen";

export default function SettingsScreen({ navigation }) {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isRemindersEnabled, setIsRemindersEnabled] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const profileImage = null;

  const toggleNotificationSwitch = () =>
    setIsNotificationsEnabled((previousState) => !previousState);
  const toggleReminderSwitch = () =>
    setIsRemindersEnabled((previousState) => !previousState);

  const capitalizeWord = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const handleLogout = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      {
        text: "No",
        onPress: () => console.log("Cancel pressed"),
        style: "destructive",
      },
      {
        text: "Yes",
        onPress: () => logout(),
      },
    ]);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error("Unable to fetch user information:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.settingsContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.settingsContent}>
        <View style={styles.profileContainer}>
          <View>
            {profileImage ? (
              <Image></Image>
            ) : (
              <View
                style={{
                  backgroundColor: "#EEF2FF",
                  borderRadius: 50,
                  padding: 20,
                }}
              >
                <Text
                  style={{ color: "#4F46E4", fontSize: 20, fontWeight: 500 }}
                >
                  DT
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileInfoContainer}>
            <Text style={styles.userName}>
              {userData.firstName + " " + userData.lastName}
            </Text>
            <Text style={styles.userLevel}>
              {userData.major.toUpperCase()} • {capitalizeWord(userData.level)}{" "}
              • GPA {userData.gpa.toFixed(1)}
            </Text>
            <Text style={styles.userCollege}>KSU</Text>
          </View>
        </View>
        <View style={styles.preferenceContainer}>
          <View style={styles.preferenceTitleContainer}>
            <Text style={styles.preferencesTitle}>Preferences</Text>
          </View>
          <View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Push notifications</Text>
              <Switch
                trackColor={{ false: "BEBEBD", true: "#4F46E4" }}
                onValueChange={toggleNotificationSwitch}
                value={isNotificationsEnabled}
              />
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Study reminders</Text>
              <Switch
                trackColor={{ false: "BEBEBD", true: "#4F46E4" }}
                onValueChange={toggleReminderSwitch}
                value={isRemindersEnabled}
              />
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Major</Text>
              <Text style={styles.optionStatus}>
                {userData.major === "cs"
                  ? "Computer Science"
                  : "Information Technology"}
              </Text>
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>College level</Text>
              <Text style={styles.optionStatus}>
                {capitalizeWord(userData.level)}
              </Text>
            </View>
            <View style={styles.optionContainer}>
              <Text style={styles.optionText}>Completed courses</Text>
              <TouchableOpacity>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.preferenceTitleContainer}>
              <Text style={styles.preferencesTitle}>Account</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.optionContainer}
            >
              <Text style={styles.signoutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 10,
    paddingHorizontal: 20,
    paddingTop: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 500,
  },
  settingsContent: {
    marginHorizontal: 20,
  },
  profileContainer: {
    paddingVertical: 20,
    flexDirection: "row",
    gap: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    alignItems: "center",
  },
  profileInfoContainer: {},
  userName: {
    fontSize: 22,
    fontWeight: 500,
  },
  userLevel: {
    color: "#73726C",
    fontSize: 16,
  },
  userCollege: {
    backgroundColor: "#FFCC00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  optionContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
  },
  preferencesTitle: {
    color: "#73726C",
    fontSize: 15,
  },
  preferenceTitleContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: "#4F46E4",
  },
  optionStatus: {
    fontSize: 16,
  },
  signoutText: {
    color: "#E14C4A",
    fontSize: 18,
  },
});
