import { ColorPicker } from '@/components/ColorPicker';
import { useExpenses } from '@/context/ExpenseContext';
import { Category } from '@/types';
import { Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

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
      <View style={[styles.categoryItem, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.categoryTotal}>{total.toFixed(2)} DZD</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item)}
        >
          <Trash2 size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {categories.length} {categories.length === 1 ? 'Category' : 'Categories'}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories yet. Create your first category!</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Add Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setCategoryName('');
                  setNameError('');
                }}
              >
                <X size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={(text) => {
                  setCategoryName(text);
                  if (nameError) setNameError('');
                }}
                placeholder="Enter category name"
                maxLength={20}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category Color</Text>
              <ColorPicker
                selectedColor={categoryColor}
                onSelectColor={setCategoryColor}
              />
            </View>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddCategory}
            >
              <Text style={styles.saveButtonText}>Save Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2F2F7',
  },
  headerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  categoryItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  categoryTotal: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
});