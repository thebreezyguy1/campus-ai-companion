import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

export default function AddressPicker({ placeholder, onSelect }) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  const [modalVisible, setModalVisible] = useState(false);
  const [displayValue, setDisplayValue] = useState("");

  return (
    <>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={displayValue ? styles.valueText : styles.placeholderText}>
          {displayValue || placeholder || "Enter address"}
        </Text>

        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Search Address</Text>
              <View style={{ width: 50 }} />
            </View>

            <GooglePlacesAutocomplete
              placeholder={placeholder || "Enter address"}
              fetchDetails={true}
              autoFocus={true}
              onPress={(data, details = null) => {
                const address = {
                  formattedAddress:
                    details?.formatted_address || data.description,
                  lat: details?.geometry?.location?.lat,
                  lng: details?.geometry?.location?.lng,
                };
                setDisplayValue(address.formattedAddress);
                onSelect(address);
                setModalVisible(false);
              }}
              onFail={(error) => console.log("Places API error:", error)}
              onNotFound={() => console.log("No results found")}
              query={{
                key: apiKey,
                language: "en",
                components: "country:us",
              }}
              styles={{
                container: { flex: 1 },
                textInput: styles.modalInput,
                listView: styles.modalListView,
                description: styles.description,
                row: styles.row,
              }}
              enablePoweredByContainer={false}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </Modal>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#BEBEBD",
    borderRadius: 10,
    padding: 13,
    backgroundColor: "#F6F3ED",
  },
  valueText: {
    fontSize: 15,
    color: "#111827",
  },
  placeholderText: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    fontSize: 15,
    color: "#4F46E5",
    width: 50,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#BEBEBD",
    borderRadius: 10,
    padding: 13,
    fontSize: 15,
    margin: 16,
    backgroundColor: "#F6F3ED",
  },
  modalListView: {
    backgroundColor: "#fff",
  },
  row: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  description: {
    fontSize: 14,
    color: "#374151",
  },
});
