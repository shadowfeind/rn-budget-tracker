import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { toast } from "sonner-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, saveCategory, deleteCategory } from "@/utils/storage";
import type { Category } from "@/types";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Fade in animation when categories load
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [categories]);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to load categories");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      if (isEditing && editingCategory) {
        // Update existing category
        const updatedCategory: Category = {
          ...editingCategory,
          name: newCategoryName.trim(),
        };

        await saveCategory(updatedCategory);
        toast.success("Category updated successfully");
      } else {
        // Add new category
        const newCategory: Category = {
          id: Date.now().toString(),
          name: newCategoryName.trim(),
        };

        await saveCategory(newCategory);
        toast.success("Category added successfully");
      }

      resetForm();
      loadCategories();
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update category" : "Failed to add category"
      );
      console.error(error);
    }
  };

  const handleEditCategory = (category: Category) => {
    setIsEditing(true);
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setModalVisible(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(categoryId);
              loadCategories();
              toast.success("Category deleted successfully");
            } catch (error) {
              toast.error("Failed to delete category");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setModalVisible(false);
    setNewCategoryName("");
    setIsEditing(false);
    setEditingCategory(null);
  };

  const renderRightActions = (categoryId: string) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          className="bg-red-500 justify-center items-center w-20"
          onPress={() => handleDeleteCategory(categoryId)}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#EEF1DA]">
      <LinearGradient
        colors={["#ADB2D4", "#C7D9DD"]}
        className="p-6 pt-12 rounded-b-3xl"
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-white">Categories</Text>
          <View className="bg-white/20 rounded-full p-2">
            <Text className="text-white font-medium px-2">
              {categories.length}{" "}
              {categories.length === 1 ? "Category" : "Categories"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#ADB2D4" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-2">
          {categories.length === 0 ? (
            <View className="flex-1 justify-center items-center mt-20">
              <View className="bg-white/50 rounded-full p-6 mb-4">
                <Ionicons name="list" size={40} color="#ADB2D4" />
              </View>
              <Text className="text-lg text-gray-600 text-center">
                No categories yet
              </Text>
              <Text className="text-sm text-gray-500 text-center mt-2 mb-4">
                Tap the + button to add your first category
              </Text>
            </View>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              {categories.map((category) => (
                <Swipeable
                  key={category.id}
                  renderRightActions={() => renderRightActions(category.id)}
                >
                  <TouchableOpacity
                    onPress={() => handleEditCategory(category)}
                    className="bg-white rounded-xl p-4 mb-3 shadow-lg"
                    activeOpacity={0.7}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-xl font-medium">
                          {category.name}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Swipe left to delete
                        </Text>
                      </View>
                      <View className="bg-[#EEF1DA] w-12 h-12 rounded-full items-center justify-center">
                        <Ionicons name="list" size={22} color="#ADB2D4" />
                      </View>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              ))}
            </Animated.View>
          )}
          <View className="h-20" />
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6"
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#ADB2D4", "#C7D9DD"]}
          className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={32} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold">
                {isEditing ? "Edit Category" : "Add New Category"}
              </Text>
              <TouchableOpacity onPress={resetForm}>
                <Ionicons name="close" size={24} color="#ADB2D4" />
              </TouchableOpacity>
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 mb-2 font-medium">
                Category Name
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Enter category name"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleAddCategory}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={resetForm}
                className="flex-1 p-4 bg-gray-100 rounded-xl"
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddCategory}
                className="flex-1 p-4 rounded-xl"
                style={{
                  backgroundColor: "#ADB2D4",
                }}
              >
                <Text className="text-center text-white font-medium">
                  {isEditing ? "Update" : "Add Category"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
