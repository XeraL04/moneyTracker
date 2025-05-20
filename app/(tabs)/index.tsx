import { ExpenseCard } from '@/components/ExpenseCard';
import { TotalCard } from '@/components/TotalCard';
import { useExpenses } from "@/context/ExpenseContext";
import { ExpenseWithCategory } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { isLoading, totalSpending, categoryTotals, categories, getExpensesWithCategories } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(true);

  const expenses = getExpensesWithCategories();
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // We're already updating state with context, so just wait a bit
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TotalCard 
        totalAmount={totalSpending} 
        categoryTotals={categoryTotals}
        categories={categories}
      />
      
      <View style={styles.expensesHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowAllExpenses(!showAllExpenses)}
        >
          <Text style={styles.toggleText}>
            {showAllExpenses ? 'Show Less' : 'Show All'}
          </Text>
          {showAllExpenses ? (
            <ChevronUp size={16} color="#007AFF" {...({} as any)} />
          ) : (
            <ChevronDown size={16} color="#007AFF" {...({} as any)} />
          )}
        </TouchableOpacity>
      </View>

      {sortedExpenses.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No expenses yet. Add your first expense!</Text>
        </View>
      ) : (
        <FlatList
          data={showAllExpenses ? sortedExpenses : sortedExpenses.slice(0, 5)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: ExpenseWithCategory }) => (
            <ExpenseCard expense={item} />
          )}
          contentContainerStyle={styles.listContent}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginLeft: 16,
  },
  expensesHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginVertical: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});