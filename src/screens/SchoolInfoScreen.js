import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import RegistrationStepsHeader from "../components/RegistrationStepsHeader";
import DatePickerField from "../components/DatePickerField";

export default function SchoolInfoScreen({ navigation, route }) {
  const { personalInfo } = route.params;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [gpa, setGpa] = useState("");

  const [levelOpen, setLevelOpen] = useState(false);
  const [level, setLevel] = useState(null);
  const [levelItems] = useState([
    { label: "Freshman", value: "freshman" },
    { label: "Sophomore", value: "sophomore" },
    { label: "Junior", value: "junior" },
    { label: "Senior", value: "senior" },
  ]);

  const [majorOpen, setMajorOpen] = useState(false);
  const [major, setMajor] = useState(null);
  const [majorItems] = useState([
    { label: "Computer Science", value: "cs" },
    { label: "Information Technology", value: "it" },
  ]);

  const handleNext = () => {
    // if (!level || !major || !gpa || !startDate || !endDate) {
    //   alert("Please fill in all required fields.");
    //   return;
    // }
    navigation.navigate("ProgramInfo", {
      personalInfo,
      schoolInfo: {
        collegeName: "Kennesaw State University",
        collegeAddress: "1000 Chastain Road, Kennesaw, GA 30144",
        level,
        startDate: startDate.toISOString(),
        anticipatedEndDate: endDate.toISOString(),
        major,
        gpa: parseFloat(gpa),
      },
    });
    let schoolInfo = {
      personalInfo,
      schoolInfo: {
        collegeName: "Kennesaw State University",
        collegeAddress: "1000 Chastain Road, Kennesaw, GA 30144",
        level,
        startDate: startDate.toISOString(),
        anticipatedEndDate: endDate.toISOString(),
        major,
        gpa: parseFloat(gpa),
      },
    };
    console.log(schoolInfo);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backRow}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.backArrow}>←</Text>
        <Text style={styles.backText}>Back to Personal Info</Text>
      </TouchableOpacity>

      <Text style={styles.title}>School Info</Text>
      <RegistrationStepsHeader activeIndex={2} />

      <View style={styles.schoolContainer}>
        <View style={styles.schoolLogo}>
          <Text style={styles.schoolLogoText}>KSU</Text>
        </View>
        <View style={styles.schoolName}>
          <Text style={styles.schoolNameText}>Kennesaw State University</Text>
        </View>
      </View>

      <Text style={styles.label}>College Level</Text>
      <DropDownPicker
        open={levelOpen}
        value={level}
        items={levelItems}
        setOpen={setLevelOpen}
        setValue={setLevel}
        placeholder="College Level"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={4000}
      />

      <Text style={styles.label}>Major</Text>
      <DropDownPicker
        open={majorOpen}
        value={major}
        items={majorItems}
        setOpen={setMajorOpen}
        setValue={setMajor}
        placeholder="Select Major"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        zIndex={3000}
      />

      <DatePickerField
        label={"Start Date"}
        value={startDate}
        onChange={setStartDate}
        placeholder="MM/YYYY"
      />

      <DatePickerField
        label={"End Date"}
        value={endDate}
        onChange={setEndDate}
        minimumDate={startDate}
        placeholder="MM/YYYY"
      />

      <Text style={styles.label}>Current GPA</Text>
      <TextInput
        style={styles.input}
        placeholder="Current GPA (e.g. 3.5)"
        value={gpa}
        onChangeText={setGpa}
        keyboardType="decimal-pad"
      />

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
    flex: 1,
  },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "gray", marginBottom: 24 },
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
  schoolContainer: {
    borderWidth: 1,
    borderColor: "#FFCC00",
    backgroundColor: "#FEFBEB",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  schoolLogo: {
    backgroundColor: "#FFCC00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  schoolLogoText: {
    fontWeight: "600",
  },
  schoolNameText: {
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 5,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backArrow: { fontSize: 16, color: "#666", marginRight: 4 },
  backText: { fontSize: 14, color: "#666" },
});
