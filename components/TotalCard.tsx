import { Category } from "@/types";
import { ChevronDown, ChevronUp, ChartPie as PieChart } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TotalCardProps {
    totalAmount: number;
    categoryTotals: Record<string, number>;
    categories: Category[];
}

export function TotalCard({ totalAmount, categoryTotals, categories }: TotalCardProps) {
    const [expanded, setExpanded] = useState(false);

    // Get non-zero category totals and sort by amount (highest first)
    const categoryData = categories
        .filter(cat => !!categoryTotals[cat.id])
        .map(cat => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
            amount: categoryTotals[cat.id] || 0,
        }))
        .sort((a, b) => b.amount - a.amount);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container}>
            <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Spending</Text>
                <Text style={styles.totalAmount}>{totalAmount.toFixed(2)} DZD</Text>
            </View>

            <TouchableOpacity
                style={styles.breakdownToggle}
                onPress={toggleExpanded}
            >
                <View style={styles.breakdownHeader}>
                    <PieChart size={18} color="#007AFF" {...({} as any)} />
                    <Text style={styles.breakdownText}>Category Breakdown</Text>
                </View>

                {expanded ? (
                    <ChevronUp size={16} color="#8E8E93" {...({} as any)}/>
                ) : (
                    <ChevronDown size={16} color="#8E8E93" {...({} as any)}/>
                )}
            </TouchableOpacity>

            {expanded && (
                <View style={styles.breakdownContainer}>
                    {categoryData.length === 0 ? (
                        <Text style={styles.noDataText}>No spending data available</Text>
                    ) : (
                        categoryData.map(cat => (
                            <View key={cat.id} style={styles.categoryRow}>
                                <View style={styles.categoryNameContainer}>
                                    <View
                                        style={[styles.colorIndicator, { backgroundColor: cat.color }]}
                                    />
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                </View>
                                <Text style={styles.categoryAmount}>{cat.amount.toFixed(2)} DZD</Text>
                            </View>
                        ))
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    totalContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    totalLabel: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 8,
    },
    totalAmount: {
        fontFamily: 'Inter-Bold',
        fontSize: 32,
        color: '#000000',
    },
    breakdownToggle: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breakdownText: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 8,
    },
    breakdownContainer: {
        padding: 16,
        backgroundColor: '#F9F9FA',
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    categoryNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    categoryName: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#000000',
    },
    categoryAmount: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: '#000000',
    },
    noDataText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E8E93',
        textAlign: 'center',
        paddingVertical: 8,
    },
});