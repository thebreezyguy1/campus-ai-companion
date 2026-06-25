import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePickerField({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
  placeholder = "Select date",
}) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handleAndroidChange = (event, selectedDate) => {
    setShow(false);
    if (event.type === "dismissed") return;
    if (selectedDate) onChange(selectedDate);
  };

  const handleIosChange = (event, selectedDate) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmIosDate = () => {
    onChange(tempDate);
    setShow(false);
  };

  const openPicker = () => {
    setTempDate(value || new Date());
    setShow(true);
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input} onPress={openPicker}>
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? value.toLocaleDateString() : placeholder}
        </Text>
      </TouchableOpacity>

      {Platform.OS === "android" && show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={show}
          transparent
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIosDate}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleIosChange}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                style={styles.spinner}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#BEBEBD",
    borderRadius: 10,
    padding: 13,
    backgroundColor: "#F6F3ED",
    marginBottom: 15,
  },
  valueText: {
    fontSize: 15,
    color: "#73726C",
  },
  placeholderText: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cancelText: {
    fontSize: 15,
    color: "#6B7280",
  },
  doneText: {
    fontSize: 15,
    color: "#4F46E5",
    fontWeight: "600",
  },
  spinner: {
    height: 200,
  },
});
