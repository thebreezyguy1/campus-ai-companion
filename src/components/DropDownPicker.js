import { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// items: [{ label, value }]
// value: currently selected value (or null)
// onSelect: (value) => void
export default function DropDownPicker({
  items,
  value,
  onSelect,
  placeholder = "Select a course",
}) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const slideAnim = useRef(new Animated.Value(300)).current;

  const selectedLabel = items.find((i) => i.value === value)?.label;

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, query]);

  const openModal = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      setQuery("");
    });
  };

  const handleSelect = (item) => {
    onSelect(item.value);
    closeModal();
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={openModal}>
        <Text
          style={[styles.triggerText, !selectedLabel && styles.placeholder]}
        >
          {selectedLabel || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#73726C" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.backdrop} onPress={closeModal} />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color="#73726C" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search courses..."
              placeholderTextColor="#73726C"
              style={styles.searchInput}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <Ionicons name="close-circle" size={18} color="#B4B2A9" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.value}
            style={styles.list}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <Text style={styles.emptyText}>No matching courses</Text>
            }
            renderItem={({ item }) => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      isSelected && styles.itemTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#4F46E4" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDEDED",
    backgroundColor: "#fff",
  },
  triggerText: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  placeholder: {
    color: "#73726C",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#EDEDED",
    alignSelf: "center",
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
  },
  list: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  itemText: {
    fontSize: 15,
    color: "#1A1A1A",
    flex: 1,
    marginRight: 8,
  },
  itemTextSelected: {
    color: "#4F46E4",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: "#73726C",
    paddingVertical: 20,
  },
});
