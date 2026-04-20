import { useState } from "react";
import { registerWithEmail } from "../services/authService";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


const COURSES_BY_MAJOR = {
    cs: [
      // Year 1
      { label: 'ENGL 1101 - English Composition I', value: 'ENGL1101' },
      { label: 'POLS 1101 - American Government', value: 'POLS1101' },
      { label: 'ECON 1000 - Contemporary Economic Issues', value: 'ECON1000' },
      { label: 'CSE 1321 - Programming Problem Solving I', value: 'CSE1321' },
      { label: 'CSE 1321L - Programming Problem Solving I Lab', value: 'CSE1321L' },
      { label: 'ENGL 1102 - English Composition II', value: 'ENGL1102' },
      { label: 'CSE 1322 - Programming Problem Solving II', value: 'CSE1322' },
      { label: 'CSE 1322L - Programming Problem Solving II Lab', value: 'CSE1322L' },
      { label: 'MATH 2345 - Discrete Mathematics', value: 'MATH2345' },
      // Year 2
      { label: 'MATH 2202 - Calculus II', value: 'MATH2202' },
      { label: 'CS 3305 - Data Structures', value: 'CS3305' },
      { label: 'TCOM 2010 - Technical Writing', value: 'TCOM2010' },
      { label: 'CS 3410 - Intro to Database Systems', value: 'CS3410' },
      { label: 'CS 3503 - Computer Organization & Architecture', value: 'CS3503' },
      { label: 'CS 3622 - Fundamentals of Data Communications', value: 'CS3622' },
      // Year 3
      { label: 'CS 3502 - Operating Systems', value: 'CS3502' },
      { label: 'STAT 2332 - Probability and Data Analysis', value: 'STAT2332' },
      { label: 'SWE 3313 - Intro to Software Engineering', value: 'SWE3313' },
      { label: 'CS 4308 - Concepts of Programming Languages', value: 'CS4308' },
      { label: 'MATH 3260 - Linear Algebra I', value: 'MATH3260' },
      { label: 'CSE 3801 - Professional Practices & Ethics', value: 'CSE3801' },
      // Year 4
      { label: 'CS 4306 - Algorithm Analysis', value: 'CS4306' },
      { label: 'CS 4504 - Parallel & Distributed Computing', value: 'CS4504' },
      { label: 'CS 4850 - Senior Project', value: 'CS4850' },
    ],
    it: [
      // Year 1
      { label: 'ENGL 1101 - English Composition I', value: 'ENGL1101' },
      { label: 'IT 1114 - Programming Principles', value: 'IT1114' },
      { label: 'IT 1114L - Programming Principles Lab', value: 'IT1114L' },
      { label: 'IT 1103 - Intro to Information Technology', value: 'IT1103' },
      { label: 'ENGL 1102 - English Composition II', value: 'ENGL1102' },
      { label: 'CSE 1321 - Programming Problem Solving I', value: 'CSE1321' },
      { label: 'CSE 1321L - Programming Problem Solving I Lab', value: 'CSE1321L' },
      { label: 'ECON 1000 - Contemporary Economic Issues', value: 'ECON1000' },
      // Year 2
      { label: 'CSE 3153 - Database Systems', value: 'CSE3153' },
      { label: 'IT 3123 - Hardware & Software Concepts', value: 'IT3123' },
      { label: 'MATH 2345 - Discrete Mathematics', value: 'MATH2345' },
      { label: 'IT 3423 - Operating Systems Concepts & Admin', value: 'IT3423' },
      { label: 'POLS 1101 - American Government', value: 'POLS1101' },
      { label: 'IT 3703 - Intro to Data Analytics & Technology', value: 'IT3703' },
      { label: 'STAT 1401 - Elementary Statistics', value: 'STAT1401' },
      // Year 3
      { label: 'IT 4323 - Data Communications & Networking', value: 'IT4323' },
      { label: 'IT 4823 - Information Security Administration', value: 'IT4823' },
      { label: 'IT 3203 - Intro to Web Development', value: 'IT3203' },
      { label: 'IT 3223 - IT Organization & Management', value: 'IT3223' },
      { label: 'IT 3883 - Advanced Application Development', value: 'IT3883' },
      { label: 'IT 4423 - Linux/Unix Administration', value: 'IT4423' },
      { label: 'CSE 3801 - Professional Practices & Ethics', value: 'CSE3801' },
      // Year 4
      { label: 'IT 4723 - IT Policy & Law', value: 'IT4723' },
      { label: 'IT 4983 - IT Capstone Project', value: 'IT4983' },
    ],
  };

  export default function ProgramInfoScreen({ navigation, route }) {
    const { personalInfo, schoolInfo }      = route.params;
    const [search, setSearch]               = useState('');
    const [completedCourses, setCompleted]  = useState([]);
    const [loading, setLoading]             = useState(false);
    
    const COURSE_LIST = COURSES_BY_MAJOR[schoolInfo.major] || [];
    
    const filtered = COURSE_LIST.filter(c => 
      c.label.toLowerCase().includes(search.toLowerCase()) &&
      !completedCourses.includes(c.value)
    );

    const toggleCourse = (value) => {
      setCompleted(prev => 
        prev.includes(value)
          ? prev.filter(c => c !== value)
          : [...prev, value]
      );
    };

    const handleRegister = async () => {
      setLoading(true);
      try {
        const user = await registerWithEmail(
          `${personalInfo.firstName} ${personalInfo.lastName}`,
          personalInfo.email,
          personalInfo.password,
          { ...personalInfo, ...schoolInfo, completedCourses }
        );
      } catch (e) {
        alert(e.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Program Info</Text>
        <Text style={styles.subtitle}>Step 3 of 3 - Select completed courses</Text>

        <TextInput 
          style={styles.search} placeholder="Search courses..."
          value={search} onChangeText={setSearch}
        />

        {completedCourses.map(val => {
          const course = COURSE_LIST.find(c => c.value === val);
          return (
            <TouchableOpacity key={val} onPress={() => toggleCourse(val)}>
                <Text style={styles.selectedCourse}>✓ {course?.label} ✕</Text>
            </TouchableOpacity>
          );
        })}

        {filtered.map(course => (
          <TouchableOpacity key={course.value} style={styles.courseItem}
            onPress={() => toggleCourse(course.value)}>
              <Text style={styles.courseText}>{course.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleRegister} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Text>
        </TouchableOpacity>

      </ScrollView>
    )
  }

  const styles = StyleSheet.create({
    container: { padding: 24, paddingTop: 60 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'gray', marginBottom: 16 },
    search: {
      borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
      padding: 12, marginBottom: 16, fontSize: 15, backgroundColor: '#fff',
    },
    selectedBox: {
      backgroundColor: '#EEF2FF', borderRadius: 10,
      padding: 12, marginBottom: 16,
    },
    selectedLabel: { fontWeight: 'bold', marginBottom: 6, color: '#4F46E5' },
    selectedCourse: { color: '#4F46E5', marginBottom: 4 },
    courseItem: {
      padding: 14, borderWidth: 1, borderColor: '#ddd',
      borderRadius: 10, marginBottom: 10, backgroundColor: '#fff',
    },
    courseText: { fontSize: 15 },
    button: {
      backgroundColor: '#4F46E5', padding: 16,
      borderRadius: 12, alignItems: 'center', marginTop: 16,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });