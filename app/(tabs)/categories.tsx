import { ColorPicker } from '@/components/ColorPicker';
import { useExpenses } from '@/context/ExpenseContext';
import { Category } from '@/types';
import {
  Box,
  Button,
  Center,
  Fab,
  FabIcon,
  HStack,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Pressable,
  ScrollView,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';

export default function CategoriesScreen() {
  const { categories, addCategory, deleteCategory, categoryTotals } = useExpenses();
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#007AFF');
  const [nameError, setNameError] = useState('');

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setNameError('Please enter a category name');
      return;
    }

    // Check for duplicate names
    const isDuplicate = categories.some(
      cat => cat.name.toLowerCase() === categoryName.trim().toLowerCase()
    );

    if (isDuplicate) {
      setNameError('This category name already exists');
      return;
    }

    try {
      await addCategory({
        name: categoryName.trim(),
        color: categoryColor,
      });
      
      // Reset form and close modal
      setCategoryName('');
      setCategoryColor('#007AFF');
      setModalVisible(false);
      setNameError('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add category. Please try again.');
    }
  };

  const handleDeleteCategory = (category: Category) => {
    // Check if category has expenses
    const hasExpenses = categoryTotals[category.id] > 0;
    
    Alert.alert(
      'Delete Category',
      hasExpenses 
        ? `This category has expenses. Deleting it will also delete all associated expenses. Are you sure?` 
        : `Are you sure you want to delete "${category.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(category.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete category. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderCategoryItem = ({ item }: { item: Category }) => {
    const total = categoryTotals[item.id] || 0;
    
    return (
      <Box
        bg="$white"
        mx="$4"
        my="$1.5"
        borderRadius="$lg"
        p="$4"
        borderLeftWidth="$1"
        borderLeftColor={item.color}
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 1 }}
        shadowOpacity={0.1}
        shadowRadius={2}
        elevation={2}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <VStack flex={1}>
            <Text
              fontFamily="$heading"
              fontSize="$md"
              color="$black"
              fontWeight="$semibold"
            >
              {item.name}
            </Text>
            <Text
              fontFamily="$body"
              fontSize="$sm"
              color="$coolGray500"
              mt="$1"
            >
              {total.toFixed(2)} DZD
            </Text>
          </VStack>
          <Pressable
            p="$2"
            onPress={() => handleDeleteCategory(item)}
          >
            <Trash2 size={20} color="#FF3B30" />
          </Pressable>
        </HStack>
      </Box>
    );
  };

  const ListHeader = () => (
    <Box px="$4" py="$3" bg="$coolGray50">
      <Text
        fontFamily="$body"
        fontSize="$sm"
        color="$coolGray500"
        fontWeight="$medium"
      >
        {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
      </Text>
    </Box>
  );

  const ListEmpty = () => (
    <Center flex={1} pt="$24" px="$6">
      <Text
        fontFamily="$body"
        fontSize="$md"
        color="$coolGray500"
        fontWeight="$medium"
        textAlign="center"
      >
        No categories yet. Create your first category!
      </Text>
    </Center>
  );

  return (
    <Box flex={1} bg="$coolGray50">
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
      />
      
      <Fab
        size="lg"
        placement="bottom right"
        bg="$blue600"
        onPress={() => setModalVisible(true)}
      >
        <FabIcon as={Plus} />
      </Fab>
      
      {/* Add Category Modal */}
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setCategoryName('');
          setNameError('');
        }}
      >
        <ModalBackdrop />
        <ModalContent maxHeight="80%">
          <ModalHeader>
            <Text
              fontFamily="$heading"
              fontSize="$lg"
              fontWeight="$semibold"
            >
              Add New Category
            </Text>
            <ModalCloseButton>
              <X size={24} color="#8E8E93" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <ScrollView>
              <VStack space="lg">
                <VStack space="sm">
                  <Text
                    fontFamily="$body"
                    fontSize="$md"
                    fontWeight="$medium"
                    color="$black"
                  >
                    Category Name
                  </Text>
                  <Input
                    variant="outline"
                    size="md"
                    isInvalid={!!nameError}
                  >
                    <InputField
                      placeholder="Enter category name"
                      value={categoryName}
                      onChangeText={(text) => {
                        setCategoryName(text);
                        if (nameError) setNameError('');
                      }}
                      maxLength={20}
                    />
                  </Input>
                  {nameError ? (
                    <Text
                      fontFamily="$body"
                      fontSize="$sm"
                      color="$red500"
                      mt="$1"
                    >
                      {nameError}
                    </Text>
                  ) : null}
                </VStack>
                
                <VStack space="sm">
                  <Text
                    fontFamily="$body"
                    fontSize="$md"
                    fontWeight="$medium"
                    color="$black"
                  >
                    Category Color
                  </Text>
                  <ColorPicker
                    selectedColor={categoryColor}
                    onSelectColor={setCategoryColor}
                  />
                </VStack>
                
                <Button
                  size="lg"
                  variant="solid"
                  bg="$blue600"
                  onPress={handleAddCategory}
                  mt="$4"
                >
                  <Text
                    fontFamily="$heading"
                    fontSize="$md"
                    fontWeight="$semibold"
                    color="$white"
                  >
                    Save Category
                  </Text>
                </Button>
              </VStack>
            </ScrollView>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}