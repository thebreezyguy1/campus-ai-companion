import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { COURSES_BY_MAJOR } from "../constants/courses";
import { useUser } from "../context/UserContext";
import DropDownPicker from "../components/DropDownPicker";
import { updateCompletedCourses } from "../services/userService";

export default function EditCoursesScreen({ navigation }) {
  const { profile } = useUser();
  const catalog = COURSES_BY_MAJOR[profile.major];

  const [value, setValue] = useState(null);
  const [completedCourses, setCompletedCourses] = useState(
    profile.completedCourses,
  );
  const [saving, setSaving] = useState(false);

  const availableItems = useMemo(
    () => catalog.filter((c) => !completedCourses.includes(c.value)),
    [completedCourses, catalog],
  );

  const removeCourse = async (course) => {
    setCompletedCourses((prev) => prev.filter((c) => c !== course));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      updateCompletedCourses(completedCourses);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to save completed courses:", error);
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
        <Text style={styles.title}>Completed courses</Text>
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.description}>
          Add a course code/name below, then tap save to update your profile.
        </Text>
        <View>
          <DropDownPicker
            items={availableItems}
            value={value}
            onSelect={(selected) => {
              setValue(selected);
              if (!completedCourses.includes(selected)) {
                setCompletedCourses((prev) => [...prev, selected]);
              }
            }}
            placeholder="e.g. CSCI 1301"
          />
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text style={styles.smallTitle}>Completed courses</Text>
          <View style={styles.courseContainer}>
            {completedCourses?.length === 0 ? (
              <View style={styles.noCourseContainer}>
                <Text
                  style={{ fontSize: 20, fontWeight: 500, color: "#4F46E4" }}
                >
                  No courses added yet
                </Text>
              </View>
            ) : (
              <View style={styles.completedCourseContainer}>
                {completedCourses.map((course, id) => {
                  return (
                    <View style={styles.completedCourse} key={id}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View style={styles.checkmark}>
                          <Ionicons
                            name="checkmark"
                            size={24}
                            color="#4F46E4"
                          />
                        </View>
                        <Text style={{ marginLeft: 10, fontSize: 20 }}>
                          {course}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => removeCourse(course)}>
                        <Ionicons name="trash" size={24} color="#E14C4A" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}
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
  description: {
    color: "#73726C",
    marginBottom: 20,
    fontSize: 16,
  },
  smallTitle: {
    color: "#73726C",
    fontSize: 16,
  },
  checkmark: {
    backgroundColor: "#EEF2FF",
    padding: 10,
    borderRadius: 50,
  },
  courseContainer: {
    flex: 1,
  },
  noCourseContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    marginVertical: 10,
  },
  completedCourse: {
    flexDirection: "row",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
});
