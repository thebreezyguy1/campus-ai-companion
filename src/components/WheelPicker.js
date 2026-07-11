import { useRef, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING_COUNT = Math.floor(VISIBLE_ITEMS / 2);

/**
 * Pure-JS scrollable wheel picker. No native modules required,
 * so it works inside Expo Go (unlike @react-native-picker/picker).
 *
 * items: array of { label, value, disabled? }
 * selectedValue: current value
 * onValueChange: (value) => void
 */
export default function WheelPicker({
  items,
  selectedValue,
  onValueChange,
  style,
}) {
  const listRef = useRef(null);

  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === selectedValue),
  );

  // Finds the closest non-disabled index to `index`, searching outward
  // in both directions. Falls back to `index` if everything is disabled.
  const findNearestEnabledIndex = useCallback(
    (index) => {
      if (!items[index]?.disabled) return index;
      for (let offset = 1; offset < items.length; offset++) {
        const down = index + offset;
        const up = index - offset;
        if (down < items.length && !items[down]?.disabled) return down;
        if (up >= 0 && !items[up]?.disabled) return up;
      }
      return index;
    },
    [items],
  );

  const handleMomentumScrollEnd = useCallback(
    (e) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const rawIndex = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(rawIndex, items.length - 1));
      const targetIndex = findNearestEnabledIndex(clampedIndex);
      const item = items[targetIndex];

      if (item && item.value !== selectedValue) {
        onValueChange(item.value);
      }
      // Snap to the resolved (enabled) index — this both corrects rounding
      // drift and bounces the wheel away from any disabled item it landed on.
      listRef.current?.scrollToOffset({
        offset: targetIndex * ITEM_HEIGHT,
        animated: true,
      });
    },
    [items, selectedValue, onValueChange, findNearestEnabledIndex],
  );

  const renderItem = ({ item, index }) => {
    const isSelected = index === selectedIndex;
    return (
      <View style={styles.itemContainer}>
        <Text
          style={[
            styles.itemText,
            isSelected && !item.disabled && styles.itemTextSelected,
            item.disabled && styles.itemTextDisabled,
          ]}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.wheelWrapper, style]}>
      {/* Selection highlight band, centered */}
      <View pointerEvents="none" style={styles.selectionBand} />

      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(item) => String(item.value)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * PADDING_COUNT,
        }}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={{ height: WHEEL_HEIGHT }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wheelWrapper: {
    flex: 1,
    height: WHEEL_HEIGHT,
    position: "relative",
  },
  selectionBand: {
    position: "absolute",
    top: ITEM_HEIGHT * PADDING_COUNT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "rgba(79, 70, 229, 0.04)",
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  itemTextSelected: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  itemTextDisabled: {
    color: "#D1D5DB",
  },
});
