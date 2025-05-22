import { useExpenses } from '@/context/ExpenseContext';
import { ExpenseWithCategory } from '@/types';
import { Box, HStack, Pressable, Text } from '@gluestack-ui/themed';
import { Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert } from 'react-native';

interface ExpenseCardProps {
  expense: ExpenseWithCategory;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const { deleteExpense } = useExpenses();
  const { id, amount, description, date, category } = expense;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExpense(id),
      },
    ]);
  };

  return (
    <Box
      bg="$white"
      rounded="$xl"
      p="$4"
      mb="$3"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.1}
      shadowRadius={2}
      elevation="$2"
    >
      {/* Top Row */}
      <HStack justifyContent="space-between" alignItems="center" mb="$3">
        <Box
          px="$3"
          py="$1"
          rounded="$full"
          bgColor={category.color || '$blue500'}
        >
          <Text color="$white" fontSize="$xs" fontFamily="Inter-Medium">
            {category.name}
          </Text>
        </Box>
        <Text fontSize="$xs" color="$coolGray500" fontFamily="Inter-Regular">
          {formattedDate}
        </Text>
      </HStack>

      {/* Middle Row */}
      <HStack justifyContent="space-between" alignItems="center" mb="$3">
        <Text
          fontSize="$md"
          fontFamily="Inter-Medium"
          color="$black"
          flex={1}
          numberOfLines={2}
          mr="$2"
        >
          {description}
        </Text>
        <Text fontSize="$xl" fontFamily="Inter-SemiBold" color="$black">
          {amount.toFixed(2)} DZD
        </Text>
      </HStack>

      {/* Bottom Row */}
      <HStack justifyContent="flex-end">
        <Pressable
          onPress={handleDelete}
          flexDirection="row"
          alignItems="center"
          px="$2"
          py="$1"
        >
          <Trash2 size={16} color="#FF3B30" />
          <Text fontSize="$sm" color="#FF3B30" ml="$1" fontFamily="Inter-Medium">
            Delete
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
}