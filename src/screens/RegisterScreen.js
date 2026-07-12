import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AddressPicker from "../components/AddressPicker";
import DatePickerField from "../components/DatePickerField";
import RegistrationStepsHeader from "../components/RegistrationStepsHeader";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailInUseModalVisible, setEmailInUseModalVisible] = useState(false);

  const today = new Date();

  const handleNext = async () => {
    if (!firstName || !lastName || !email || !password || !gender) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords are not matching. Please try again!");
      return;
    }

    setCheckingEmail(true);

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setEmailInUseModalVisible(true);
        setCheckingEmail(false);
        return;
      }

      navigation.navigate("SchoolInfo", {
        personalInfo: {
          firstName,
          lastName,
          dob: dob.toISOString(),
          gender,
          email: email.trim(),
          streetAddress,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const checkEmailExists = async (email) => {
    const normalizedEmail = email.toLowerCase().trim();
    const q = query(
      collection(db, "users"),
      where("email", "==", normalizedEmail),
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  };

  const handleGoToLogin = () => {
    setEmailInUseModalVisible(false);
    navigation.navigate("Login", { email: email.trim() });
  };

  const handleUseDifferentEmail = () => {
    setEmailInUseModalVisible(false);
    setEmail("");
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
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back to login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Personal Info</Text>

      <RegistrationStepsHeader activeIndex={1} />

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
        label="Date of Birth"
        value={dob}
        onChange={setDob}
        showDay={true}
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

      <TouchableOpacity
        style={[styles.button, checkingEmail && styles.buttonDisabled]}
        onPress={handleNext}
        disabled={checkingEmail}
      >
        {checkingEmail ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Next →</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={emailInUseModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEmailInUseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>You already have an account</Text>
            <Text style={styles.modalBody}>
              An account with {email.trim()} already exists. Log in instead, or
              use a different email to create a new account.
            </Text>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              onPress={handleGoToLogin}
            >
              <Text style={styles.modalPrimaryButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={handleUseDifferentEmail}
            >
              <Text style={styles.modalSecondaryButtonText}>
                Use a different email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonDisabled: {
    opacity: 0.7,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 380,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalBody: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  modalPrimaryButton: {
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  modalPrimaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  modalSecondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  modalSecondaryButtonText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 14,
  },
});
