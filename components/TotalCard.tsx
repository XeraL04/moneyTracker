import { Category } from '@/types';
import {
  Box,
  HStack,
  Pressable,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { ChevronDown, ChevronUp, ChartPie as PieChart } from 'lucide-react-native';
import React, { useState } from 'react';

interface TotalCardProps {
  totalAmount: number;
  categoryTotals: Record<string, number>;
  categories: Category[];
}

export function TotalCard({ totalAmount, categoryTotals, categories }: TotalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryData = categories
    .filter(cat => !!categoryTotals[cat.id])
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      amount: categoryTotals[cat.id] || 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <Box
      bg="$white"
      rounded="$lg"
      mx="$4"
      my="$2"
      overflow="hidden"
      shadowColor="$black"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      elevation={2}
    >
      <Box p="$5" borderBottomWidth={1} borderColor="$coolGray100">
        <Text fontFamily="Inter-Medium" fontSize="$md" color="$coolGray500" mb="$2">
          Total Spending
        </Text>
        <Text fontFamily="Inter-Bold" fontSize="$4xl" color="$black">
          {totalAmount.toFixed(2)} DZD
        </Text>
      </Box>

      <Pressable
        px="$5"
        py="$4"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        onPress={toggleExpanded}
      >
        <HStack alignItems="center">
          <PieChart size={18} color="#007AFF" />
          <Text fontFamily="Inter-Medium" fontSize="$sm" color="#007AFF" ml="$2">
            Category Breakdown
          </Text>
        </HStack>
        {expanded ? (
          <ChevronUp size={16} color="#8E8E93" />
        ) : (
          <ChevronDown size={16} color="#8E8E93" />
        )}
      </Pressable>

      {expanded && (
        <Box px="$4" py="$3" bg="#F9F9FA">
          {categoryData.length === 0 ? (
            <Text
              fontFamily="Inter-Regular"
              fontSize="$sm"
              color="$coolGray500"
              textAlign="center"
              py="$2"
            >
              No spending data available
            </Text>
          ) : (
            <VStack space="xs">
              {categoryData.map(cat => (
                <HStack
                  key={cat.id}
                  justifyContent="space-between"
                  alignItems="center"
                  py="$2"
                >
                  <HStack alignItems="center">
                    <Box
                      width={12}
                      height={12}
                      rounded="$full"
                      bg={cat.color}
                      mr="$2"
                    />
                    <Text fontFamily="Inter-Medium" fontSize="$sm" color="$black">
                      {cat.name}
                    </Text>
                  </HStack>
                  <Text fontFamily="Inter-SemiBold" fontSize="$sm" color="$black">
                    {cat.amount.toFixed(2)} DZD
                  </Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
}