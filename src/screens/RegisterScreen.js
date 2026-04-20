import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, Button, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName]     = useState('');
    const [lastName, setLastName]       = useState('');
    const [dob, setDob]                 = useState(new Date());
    const [showDob, setShowDob]         = useState(false);
    const [email, setEmail]             = useState('');
    const [password, setPassword]       = useState('');
    const [mailingAddress, setMailing]  = useState('');
    const [physicalAddress, setPhysical]= useState('');

    const [genderOpen, setGenderOpen]   = useState(false);
    const [gender, setGender]           = useState(null);
    const [genderItems] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' }
    ]);

    const handleNext = () => {
        if (!firstName || !lastName || !email || !password || !gender) {
            alert('Please fill in all required fields.');
            return;
        }
        navigation.navigate('SchoolInfo', {
            personalInfo: {
                firstName, lastName,
                dob: dob.toISOString(),
                gender, email, password,
                mailingAddress, physicalAddress,
            }
        });
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Personal Info</Text>
        <Text style={styles.subtitle}>Step 1 of 3</Text>

        <TextInput style={styles.input} placeholder='First Name'
            value={firstName} onChangeText={setFirstName} />
        <TextInput style={styles.input} placeholder='Last Name'
            value={lastName} onChangeText={setLastName} />
        
        <TouchableOpacity style={styles.input} onPress={() => setShowDob(true)}>
            <Text>{dob.toDateString()}</Text>
        </TouchableOpacity>
        {showDob && (
            <DateTimePicker 
                value={dob} mode='date' display='default'
                maximumDate={new Date()}
                onChange={(e, date) => { setShowDob(false); if (date) setDob(date); }}
            />
        )}

        <DropDownPicker 
            open={genderOpen} value={gender} items={genderItems}
            setOpen={setGenderOpen} setValue={setGender}
            placeholder='Select Gender'
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            zIndex={3000}
        />

        <TextInput style={styles.input} placeholder="Email"
            value={email} onChangeText={setEmail}
            keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password"
            value={password} onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Mailing Address"
            value={mailingAddress} onChangeText={setMailing} />
        <TextInput style={styles.input} placeholder="Physical Address (if different)"
            value={physicalAddress} onChangeText={setPhysical} />

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