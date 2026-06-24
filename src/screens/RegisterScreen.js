import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { LocationAutocomplete } from "@julekgwa/react-native-places-autocomplete";
import { LocationSuggestion } from "@julekgwa/react-native-places-autocomplete";
import AddressPicker from "../components/AddressPicker";
import DatePickerField from "../components/DatePickerField";

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDob, setShowDob] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [streetAddress, setStreetAddress] = useState(null);

  const [genderOpen, setGenderOpen] = useState(false);
  const [gender, setGender] = useState(null);
  const [genderItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]);

  const today = new Date();

  const handleNext = () => {
    if (!firstName || !lastName || !email || !password || !gender) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords are not matching. Please try again!");
      return;
    }
    navigation.navigate("SchoolInfo", {
      personalInfo: {
        firstName,
        lastName,
        dob: dob.toISOString(),
        gender,
        email,
        password,
        streetAddress,
      },
    });
  };

  useEffect(() => {
    console.log(streetAddress);
  }, [streetAddress]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="always"
      nestedScrollEnabled={true}
    >
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back to login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Personal Info</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 24,
          gap: 10,
        }}
      >
        <View style={styles.circleContainer}>
          <View style={[styles.circle, styles.activeCircle]}></View>
          <View style={styles.circle}></View>
          <View style={styles.circle}></View>
        </View>
        <Text style={styles.subtitle}>Step 1 of 3</Text>
      </View>

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
        <Text style={styles.label}>Last name</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <DatePickerField
        label={"Date of Birth"}
        value={dob}
        onChange={setDob}
        maximumDate={new Date()}
        placeholder="MM/DD/YYYY"
      />

      <Text style={styles.label}>Gender</Text>
      <DropDownPicker
        open={genderOpen}
        value={gender}
        items={genderItems}
        setOpen={setGenderOpen}
        setValue={setGender}
        placeholder="Select Gender"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
        listMode="SCROLLVIEW"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
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
      />

      <View style={{ zIndex: 100, marginBottom: 14 }}>
        <Text style={styles.label}>Street Address</Text>
        <AddressPicker
          placeholder={"Street Address"}
          onSelect={setStreetAddress}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backArrow: { fontSize: 16, color: "#666", marginRight: 4 },
  backText: { fontSize: 14, color: "#666" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "gray" },
  halfInput: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
    backgroundColor: "#F6F3ED",
    justifyContent: "center",
    color: "#73726C",
    borderColor: "#BEBEBD",
  },
  dropdown: {
    backgroundColor: "#F6F3ED",
    borderColor: "#BEBEBD",
    borderRadius: 10,
    marginBottom: 14,
    color: "#73726C",
  },
  dropdownContainer: { borderColor: "#ddd" },
  button: {
    backgroundColor: "#4F46E5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 5,
  },
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
});
