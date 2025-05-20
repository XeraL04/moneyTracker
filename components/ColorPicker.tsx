import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ColorPickerProps {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

// Predefined set of colors
const colors = [
  '#FF3B30', // Red
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#5AC8FA', // Light Blue
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#AF52DE', // Magenta
  '#FF2D55', // Pink
  '#8E8E93', // Gray
];

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor,
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#000000',
  },
});