import { ExpenseCard } from '@/components/ExpenseCard';
import { TotalCard } from '@/components/TotalCard';
import { useExpenses } from "@/context/ExpenseContext";
import { ExpenseWithCategory } from '@/types';
import {
  Box,
  FlatList,
  HStack,
  Pressable,
  RefreshControl,
  Text
} from '@gluestack-ui/themed';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useCallback, useState } from "react";

export default function HomeScreen() {
  const {
    isLoading,
    totalSpending,
    categoryTotals,
    categories,
    getExpensesWithCategories,
  } = useExpenses();

  const [refreshing, setRefreshing] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(true);

  const expenses = getExpensesWithCategories();

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text fontFamily="Inter-Medium" fontSize="$md" color="$coolGray500">
          Loading...
        </Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="#F2F2F7">
      <TotalCard
        totalAmount={totalSpending}
        categoryTotals={categoryTotals}
        categories={categories}
      />

      <HStack
        justifyContent="space-between"
        alignItems="center"
        px="$4"
        my="$4"
      >
        <Text fontFamily="Inter-SemiBold" fontSize="$lg" color="$black">
          Recent Expenses
        </Text>
        <Pressable
          flexDirection="row"
          alignItems="center"
          onPress={() => setShowAllExpenses(!showAllExpenses)}
        >
          <Text fontFamily="Inter-Medium" fontSize="$sm" color="#007AFF" mr="$1">
            {showAllExpenses ? 'Show Less' : 'Show All'}
          </Text>
          {showAllExpenses ? (
            <ChevronUp size={16} color="#007AFF" />
          ) : (
            <ChevronDown size={16} color="#007AFF" />
          )}
        </Pressable>
      </HStack>

      {sortedExpenses.length === 0 ? (
        <Box flex={1} justifyContent="center" alignItems="center" px="$6">
          <Text
            fontFamily="Inter-Medium"
            fontSize="$md"
            color="$coolGray500"
            textAlign="center"
          >
            No expenses yet. Add your first expense!
          </Text>
        </Box>
      ) : (
        <FlatList
          data={(showAllExpenses ? sortedExpenses : sortedExpenses.slice(0, 5)) as ExpenseWithCategory[]}
          keyExtractor={(item) => (item as ExpenseWithCategory).id}
          renderItem={({ item }) => <ExpenseCard expense={item as ExpenseWithCategory} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
              colors={["#007AFF"]}
            />
          }
        />
      )}
    </Box>
  );
}
