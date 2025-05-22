import { HStack, Pressable } from '@gluestack-ui/themed';
import React from 'react';

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
    <HStack flexWrap="wrap" mx={-2}>
      {colors.map((color) => {
        const isSelected = selectedColor === color;
        return (
          <Pressable
            key={color}
            onPress={() => onSelectColor(color)}
            m="$2"
            rounded="$full"
            width={40}
            height={40}
            bgColor={color}
            borderWidth={isSelected ? 3 : 0}
            borderColor={isSelected ? '$black' : 'transparent'}
          />
        );
      })}
    </HStack>
  );
}