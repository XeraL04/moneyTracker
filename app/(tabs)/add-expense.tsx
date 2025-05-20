import { useExpenses } from '@/context/ExpenseContext';
import { Category } from '@/types';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function AddExpenseScreen() {
    const { categories, addExpense } = useExpenses();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [amountError, setAmountError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [categoryError, setCategoryError] = useState('');

    useEffect(() => {
        // Pre-select first category if available
        if (categories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(categories[0].id);
        }
    }, [categories]);

    const handleAmountChange = (text: string) => {
        // Allow only numbers and decimal point
        const filtered = text.replace(/[^0-9.]/g, '');

        // Prevent multiple decimal points
        const parts = filtered.split('.');
        if (parts.length > 2) {
            return;
        }

        // Limit to 2 decimal places
        if (parts.length > 1 && parts[1].length > 2) {
            return;
        }

        setAmount(filtered);
        if (amountError) setAmountError('');
    };

    const handleDescriptionChange = (text: string) => {
        setDescription(text);
        if (descriptionError) setDescriptionError('');
    };

    const selectCategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        if (categoryError) setCategoryError('');
    };

    const validateForm = () => {
        let isValid = true;

        if (!amount || parseFloat(amount) <= 0) {
            setAmountError('Please enter a valid amount');
            isValid = false;
        }

        if (!description.trim()) {
            setDescriptionError('Please enter a description');
            isValid = false;
        }

        if (!selectedCategoryId) {
            setCategoryError('Please select a category');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            await addExpense({
                categoryId: selectedCategoryId!,
                amount: parseFloat(amount),
                description: description.trim(),
                date: new Date().toISOString(),
            });

            // Clear form
            setAmount('');
            setDescription('');

            // Show success message and navigate to home
            Alert.alert('Success', 'Expense added successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.navigate('/(tabs)')
                }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to add expense. Please try again.');
        }
    };

    const renderCategoryItem = (category: Category) => {
        const isSelected = category.id === selectedCategoryId;

        return (
            <TouchableOpacity
                key={category.id}
                style={[
                    styles.categoryItem,
                    { borderColor: category.color },
                    isSelected && { backgroundColor: `${category.color}20` }
                ]}
                onPress={() => selectCategory(category.id)}
            >
                <Text style={[styles.categoryName, { color: category.color }]}>
                    {category.name}
                </Text>
                {isSelected && (
                    <View style={[styles.checkIcon, { backgroundColor: category.color }]}>
                        <Check size={12} color="#FFFFFF" {...({} as any)} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Amount</Text>
                        <View style={styles.amountInputContainer}>
                            <Text style={styles.currencySymbol}> DZD</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={handleAmountChange}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                maxLength={10}
                            />
                        </View>
                        {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={handleDescriptionChange}
                            placeholder="What did you spend on?"
                            maxLength={100}
                        />
                        {descriptionError ? <Text style={styles.errorText}>{descriptionError}</Text> : null}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Category</Text>
                        <View style={styles.categoriesContainer}>
                            {categories.length === 0 ? (
                                <Text style={styles.noCategoriesText}>
                                    No categories available. Please add a category first.
                                </Text>
                            ) : (
                                categories.map(renderCategoryItem)
                            )}
                        </View>
                        {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={categories.length === 0}
                    >
                        <Text style={styles.submitButtonText}>Add Expense</Text>
                    </TouchableOpacity>

                    {categories.length === 0 && (
                        <TouchableOpacity
                            style={styles.createCategoryButton}
                            onPress={() => router.navigate('/(tabs)/categories' as any)}
                        >
                            <Text style={styles.createCategoryButtonText}>Create Category First</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#000000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E5EA',
        paddingHorizontal: 16,
    },
    currencySymbol: {
        fontSize: 20,
        fontFamily: 'Inter-Medium',
        color: '#000000',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 20,
        fontFamily: 'Inter-Medium',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        margin: 4,
        minWidth: 80,
    },
    categoryName: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
    },
    checkIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
    noCategoriesText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    submitButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFFFFF',
    },
    createCategoryButton: {
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    createCategoryButtonText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#007AFF',
    },
    errorText: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: '#FF3B30',
        marginTop: 4,
    },
});