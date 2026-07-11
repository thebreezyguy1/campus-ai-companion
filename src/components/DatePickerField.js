import { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import WheelPicker from "./WheelPicker";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - 30 + i);

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

export default function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Select date",
  showDay = false,
  minDate = null, // e.g. pass startDate when this field is an "End Date"
  maxDate = null,
  minDateErrorLabel = "start date", // used to phrase the inline error message
}) {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [tempMonth, setTempMonth] = useState(
    value ? value.getMonth() : new Date().getMonth(),
  );
  const [tempYear, setTempYear] = useState(
    value ? value.getFullYear() : CURRENT_YEAR,
  );
  const [tempDay, setTempDay] = useState(
    value ? value.getDate() : new Date().getDate(),
  );

  const daysInMonth = getDaysInMonth(tempMonth, tempYear);

  // Year wheel: gray out any year fully outside the [minDate, maxDate] range.
  const yearItems = useMemo(
    () =>
      YEARS.map((y) => ({
        label: String(y),
        value: y,
        disabled:
          (minDate && y < minDate.getFullYear()) ||
          (maxDate && y > maxDate.getFullYear()),
      })),
    [minDate, maxDate],
  );

  // Month wheel: only relevant within the boundary year(s) — e.g. if minDate
  // is May 2024 and tempYear is 2024, January–April are grayed out.
  const monthItems = useMemo(
    () =>
      MONTHS.map((labelText, m) => ({
        label: labelText,
        value: m,
        disabled:
          (minDate &&
            tempYear === minDate.getFullYear() &&
            m < minDate.getMonth()) ||
          (maxDate &&
            tempYear === maxDate.getFullYear() &&
            m > maxDate.getMonth()),
      })),
    [minDate, maxDate, tempYear],
  );

  // Day wheel: only relevant within the boundary year+month.
  const dayItems = useMemo(
    () =>
      Array.from({ length: daysInMonth }, (_, i) => {
        const d = i + 1;
        return {
          label: String(d),
          value: d,
          disabled:
            (minDate &&
              tempYear === minDate.getFullYear() &&
              tempMonth === minDate.getMonth() &&
              d < minDate.getDate()) ||
            (maxDate &&
              tempYear === maxDate.getFullYear() &&
              tempMonth === maxDate.getMonth() &&
              d > maxDate.getDate()),
        };
      }),
    [minDate, maxDate, tempYear, tempMonth, daysInMonth],
  );

  // If the year wheel moves into a boundary year, the currently selected
  // month/day may now be disabled — nudge them to the nearest valid value
  // so the wheels never rest somewhere the user can't actually confirm.
  useEffect(() => {
    if (
      minDate &&
      tempYear === minDate.getFullYear() &&
      tempMonth < minDate.getMonth()
    ) {
      setTempMonth(minDate.getMonth());
    } else if (
      maxDate &&
      tempYear === maxDate.getFullYear() &&
      tempMonth > maxDate.getMonth()
    ) {
      setTempMonth(maxDate.getMonth());
    }
  }, [tempYear, minDate, maxDate]);

  useEffect(() => {
    if (
      minDate &&
      tempYear === minDate.getFullYear() &&
      tempMonth === minDate.getMonth() &&
      tempDay < minDate.getDate()
    ) {
      setTempDay(minDate.getDate());
    } else if (
      maxDate &&
      tempYear === maxDate.getFullYear() &&
      tempMonth === maxDate.getMonth() &&
      tempDay > maxDate.getDate()
    ) {
      setTempDay(maxDate.getDate());
    }
  }, [tempYear, tempMonth, minDate, maxDate]);

  const openPicker = () => {
    if (value) {
      setTempMonth(value.getMonth());
      setTempYear(value.getFullYear());
      setTempDay(value.getDate());
    }
    setError(null);
    setShow(true);
  };

  const confirm = () => {
    const finalDay = showDay ? Math.min(tempDay, daysInMonth) : 1;
    const candidate = new Date(tempYear, tempMonth, finalDay);

    if (minDate && candidate < minDate) {
      setError(
        `Date can't be before ${minDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })} (${minDateErrorLabel}).`,
      );
      return;
    }
    if (maxDate && candidate > maxDate) {
      setError(
        `Date can't be after ${maxDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}.`,
      );
      return;
    }

    setError(null);
    onChange(candidate);
    setShow(false);
  };

  const formatValue = () => {
    if (!value) return placeholder;
    return showDay
      ? value.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : value.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.input} onPress={openPicker}>
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {formatValue()}
        </Text>
      </TouchableOpacity>

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
              <TouchableOpacity onPress={confirm}>
                <Text style={styles.doneText}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wheelRow}>
              <WheelPicker
                items={monthItems}
                selectedValue={tempMonth}
                onValueChange={(v) => {
                  setTempMonth(v);
                  setError(null);
                }}
              />

              {showDay && (
                <WheelPicker
                  items={dayItems}
                  selectedValue={Math.min(tempDay, daysInMonth)}
                  onValueChange={(v) => {
                    setTempDay(v);
                    setError(null);
                  }}
                />
              )}

              <WheelPicker
                items={yearItems}
                selectedValue={tempYear}
                onValueChange={(v) => {
                  setTempYear(v);
                  setError(null);
                }}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
      </Modal>
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
  valueText: { fontSize: 15, color: "#73726C" },
  placeholderText: { fontSize: 15, color: "#9CA3AF" },
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
  cancelText: { fontSize: 15, color: "#6B7280" },
  doneText: { fontSize: 15, color: "#4F46E5", fontWeight: "600" },
  wheelRow: {
    flexDirection: "row",
    height: 200,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
