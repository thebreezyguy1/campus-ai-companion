import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';


export default function SchoolInfoScreen({ navigation, route }) {
    const { personalInfo } = route.params;

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate]     = useState(new Date());
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd]     = useState(false);
    const [gpa, setGpa]             = useState('');

    const [levelOpen, setLevelOpen] = useState(false);
    const [level, setLevel]         = useState(null);
    const [levelItems] = useState([
        { label: 'Freshman', value: 'freshman' },
        { label: 'Sophomore', value: 'sophomore' },
        { label: 'Junior', value: 'junior' },
        { label: 'Senior', value: 'senior' }
    ]);

    const [majorOpen, setMajorOpen] = useState(false);
    const [major, setMajor]         = useState(null);
    const [majorItems] = useState([
        { label: 'Computer Science', value: 'cs' },
        { label: 'Information Technology', value: 'it' },
    ]);

    const handleNext = () => {
        if (!collegeName || !level || !major || !gpa) {
            alert('Please fill in all required fields.');
            return;
        }
        navigation.navigate('ProgramInfo', {
            personalInfo,
            schoolInfo: {
                collegeName: 'Kennesaw State University',
                collegeAddress: '1000 Chastain Road, Kennesaw, GA 30144', 
                level,
                startDate: startDate.toISOString(),
                anticipatedEndDate: endDate.toISOString(),
                major, gpa: parseFloat(gpa),
            }
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>School Info</Text>
            <Text style={styles.subtitle}>Step 2 of 3</Text>

            <DropDownPicker 
                open={levelOpen} value={level} items={levelItems}
                setOpen={setLevelOpen} setValue={setLevel}
                placeholder='College Level' style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={4000}
            />

            <DropDownPicker 
                open={majorOpen} value={major} items={majorItems}
                setOpen={setMajorOpen} setValue={setMajor}
                placeholder='Select Major' style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                zIndex={3000}
            />

            <TouchableOpacity style={styles.input} onPress={() => setShowStart(true)}>
                <Text>Start Date: {startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showStart && (
                <DateTimePicker value={startDate} mode='date' 
                    onChange={(e, d) => { setShowStart(false); if (d) setStartDate(d); }} />
            )}

            <TouchableOpacity style={styles.input} onPress={() => setShowEnd(true)}>
                <Text>End Date: {endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showEnd && (
                <DateTimePicker value={endDate} mode='date' 
                    onChange={(e, d) => { setShowEnd(false); if (d) setEndDate(d); }} />
            )}

            <TextInput style={styles.input} placeholder='Current GPA (e.g. 3.5)'
                value={gpa} onChangeText={setGpa} keyboardType='decimal-pad' />
            
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next →</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, paddingTop: 60 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 14, color: 'gray', marginBottom: 24 },
    input: {
      borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
      padding: 14, marginBottom: 14, fontSize: 15, backgroundColor: '#fff',
      justifyContent: 'center',
    },
    dropdown: { borderColor: '#ddd', borderRadius: 10, marginBottom: 14 },
    dropdownContainer: { borderColor: '#ddd' },
    button: {
      backgroundColor: '#4F46E5', padding: 16,
      borderRadius: 12, alignItems: 'center', marginTop: 8,
    },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  });