import { useExpenses } from "@/context/ExpenseContext";
import { ExpenseWithCategory } from "@/types";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ExpenseCardProps {
    expense: ExpenseWithCategory;
}

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const { deleteExpense } = useExpenses();
  const { id, amount, description, date, category } = expense;
  
  // Format date to a readable format
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteExpense(id),
        },
      ]
    );
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.categoryIndicator, { backgroundColor: category.color }]}>
          <Text style={styles.categoryText}>{category.name}</Text>
        </View>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
      
      <View style={styles.middleRow}>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.amountText}>{amount.toFixed(2)} DZD</Text>
      </View>
      
      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={16} color="#FF3B30" {...({} as any)}/>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  amountText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 4,
  },
});