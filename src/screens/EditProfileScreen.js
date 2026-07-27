import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import Feather from "@expo/vector-icons/Feather";
import DatePickerField from "../components/DatePickerField";
import * as ImagePicker from "expo-image-picker";
import { updateProfile, uploadProfileImage } from "../services/userService";

const COLLEGE_LEVELS = [
  { id: "freshman", value: "Freshman" },
  { id: "sophomore", value: "Sophomore" },
  { id: "junior", value: "Junior" },
  { id: "senior", value: "Senior" },
];

export default function EditProfileScreen({ navigation }) {
  const { profile } = useUser();

  const [image, setImage] = useState(profile.photoURL ?? null);
  const [firstName, setFirstName] = useState(profile.firstName ?? "");
  const [lastName, setLastName] = useState(profile.lastName ?? "");

  const [dob, setDob] = useState(new Date(profile.dob) ?? null);

  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const getInitials = () => {
    return profile.firstName.charAt(0) + profile.lastName.charAt(0);
  };

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      shape: "oval",
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validate = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Missing info", "First and last name are required.");
      return false;
    }
    if (!dob) {
      Alert.alert("Missing info", "Date of Birth is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);

    try {
      const isLocalUri = image && !image.startsWith("http");
      const downloadURL = isLocalUri ? await uploadProfileImage(image) : image;

      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dob: dob.toISOString(),
        photoURL: downloadURL,
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Couldn't save changes",
        error.message ?? "Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

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
          {image ? (
            <View>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity style={styles.cameraContainer}>
                <Feather name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
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
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.subtitle}>Personal info</Text>
          <View>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={[styles.input]}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View>
            <View>
              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={[styles.input]}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <Text style={styles.label}>Date of Birth</Text>
            <DatePickerField
              value={dob}
              onChange={setDob}
              showDay={true}
              inputStyle={styles.input}
              valueTextStyle={styles.valueTextStyle}
            />

            <Text style={styles.label}>Major</Text>
            <Text style={styles.input}>
              {profile.major === "cs"
                ? "Computer Science"
                : "Information Technology"}
            </Text>

            <Text style={styles.label}>College Level</Text>
            <Text style={styles.input}>
              {profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}
            </Text>

            <Text style={styles.label}>GPA</Text>
            <Text style={styles.input}>{profile.gpa.toFixed(1)}</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.input}>{profile.email}</Text>

            <Text style={styles.label}>School</Text>
            <Text style={styles.input}>{profile.collegeName}</Text>

            {/* <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            /> */}
          </View>
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
  label: {
    marginTop: 10,
    marginBottom: 10,
    color: "#73726C",
    fontSize: 15,
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    paddingTop: 5,
    paddingBottom: 15,
  },
  dropdown: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#73726C",
  },
  subtitle: {
    fontSize: 18,
    color: "#73726C",
    fontWeight: 500,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
    paddingVertical: 7,
  },
  valueTextStyle: {
    fontSize: 20,
    color: "#000",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: "50%",
  },
});
