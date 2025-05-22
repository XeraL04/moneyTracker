import { useExpenses } from '@/context/ExpenseContext';
import { Category } from '@/types';
import {
    Box,
    Button,
    HStack,
    Input,
    InputField,
    Pressable,
    ScrollView,
    Text,
    VStack
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';

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
            <Pressable
                key={category.id}
                onPress={() => selectCategory(category.id)}
                borderWidth="$1"
                borderColor={category.color}
                bg={isSelected ? `${category.color}20` : 'transparent'}
                borderRadius="$full"
                px="$4"
                py="$2.5"
                m="$1"
                minWidth="$20"
            >
                <HStack alignItems="center" justifyContent="center" space="xs">
                    <Text
                        fontFamily="$body"
                        fontSize="$sm"
                        fontWeight="$medium"
                        color={category.color}
                    >
                        {category.name}
                    </Text>
                    {isSelected && (
                        <Box
                            bg={category.color}
                            width="$4"
                            height="$4"
                            borderRadius="$sm"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Check size={12} color="#FFFFFF" />
                        </Box>
                    )}
                </HStack>
            </Pressable>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            <ScrollView flex={1} bg="$coolGray50">
                <Box p="$4">
                    <VStack space="xl">
                        {/* Amount Input */}
                        <VStack space="sm">
                            <Text
                                fontFamily="$body"
                                fontSize="$md"
                                fontWeight="$medium"
                                color="$black"
                            >
                                Amount
                            </Text>
                            <HStack
                                bg="$white"
                                borderRadius="$md"
                                borderWidth="$1"
                                borderColor="$coolGray300"
                                px="$4"
                                alignItems="center"
                            >
                                <Text
                                    fontSize="$xl"
                                    fontFamily="$body"
                                    fontWeight="$medium"
                                    color="$black"
                                    mr="$2"
                                >
                                    DZD
                                </Text>
                                <Input flex={1} variant="rounded">
                                    <InputField
                                        value={amount}
                                        onChangeText={handleAmountChange}
                                        placeholder="0.00"
                                        keyboardType="decimal-pad"
                                        maxLength={10}
                                        fontSize="$xl"
                                        fontWeight="$medium"
                                        py="$3"
                                    />
                                </Input>
                            </HStack>
                            {amountError ? (
                                <Text
                                    fontFamily="$body"
                                    fontSize="$sm"
                                    color="$red500"
                                    mt="$1"
                                >
                                    {amountError}
                                </Text>
                            ) : null}
                        </VStack>

                        {/* Description Input */}
                        <VStack space="sm">
                            <Text
                                fontFamily="$body"
                                fontSize="$md"
                                fontWeight="$medium"
                                color="$black"
                            >
                                Description
                            </Text>
                            <Input
                                variant="outline"
                                size="md"
                                isInvalid={!!descriptionError}
                            >
                                <InputField
                                    value={description}
                                    onChangeText={handleDescriptionChange}
                                    placeholder="What did you spend on?"
                                    maxLength={100}
                                />
                            </Input>
                            {descriptionError ? (
                                <Text
                                    fontFamily="$body"
                                    fontSize="$sm"
                                    color="$red500"
                                    mt="$1"
                                >
                                    {descriptionError}
                                </Text>
                            ) : null}
                        </VStack>

                        {/* Category Selection */}
                        <VStack space="sm">
                            <Text
                                fontFamily="$body"
                                fontSize="$md"
                                fontWeight="$medium"
                                color="$black"
                            >
                                Category
                            </Text>
                            <Box>
                                {categories.length === 0 ? (
                                    <Text
                                        fontFamily="$body"
                                        fontSize="$sm"
                                        color="$coolGray500"
                                        mt="$2"
                                    >
                                        No categories available. Please add a category first.
                                    </Text>
                                ) : (
                                    <HStack flexWrap="wrap" mx="$1">
                                        {categories.map(renderCategoryItem)}
                                    </HStack>
                                )}
                            </Box>
                            {categoryError ? (
                                <Text
                                    fontFamily="$body"
                                    fontSize="$sm"
                                    color="$red500"
                                    mt="$1"
                                >
                                    {categoryError}
                                </Text>
                            ) : null}
                        </VStack>

                        {/* Submit Button */}
                        <Button
                            size="lg"
                            variant="solid"
                            bg="$blue600"
                            onPress={handleSubmit}
                            isDisabled={categories.length === 0}
                            mt="$4"
                        >
                            <Text
                                fontFamily="$heading"
                                fontSize="$md"
                                fontWeight="$semibold"
                                color="$white"
                            >
                                Add Expense
                            </Text>
                        </Button>

                        {/* Create Category Button */}
                        {categories.length === 0 && (
                            <Button
                                size="lg"
                                variant="outline"
                                borderColor="$blue600"
                                onPress={() => router.navigate('/(tabs)/categories' as any)}
                                mt="$4"
                            >
                                <Text
                                    fontFamily="$heading"
                                    fontSize="$md"
                                    fontWeight="$semibold"
                                    color="$blue600"
                                >
                                    Create Category First
                                </Text>
                            </Button>
                        )}
                    </VStack>
                </Box>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}