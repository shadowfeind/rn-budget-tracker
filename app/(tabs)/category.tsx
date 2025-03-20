import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

import { toast } from "sonner-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, saveCategory } from "@/utils/storage";
import { Category } from "@/types";

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const categoriesData = await getCategories();
    setCategories(categoriesData);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
    };

    await saveCategory(newCategory);
    setModalVisible(false);
    setNewCategoryName("");
    loadCategories();
    toast.success("Category added successfully");
  };

  return (
    <View className="flex-1 bg-[#EEF1DA]">
      <LinearGradient
        colors={["#ADB2D4", "#C7D9DD"]}
        className="p-6 rounded-b-3xl"
      >
        <Text className="text-2xl font-bold text-white">Categories</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 -mt-4">
        {categories.map((category) => (
          <View
            key={category.id}
            className="bg-white rounded-xl p-4 mb-3 shadow-lg"
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-medium">{category.name}</Text>
              <View className="bg-[#EEF1DA] w-10 h-10 rounded-full items-center justify-center">
                <Ionicons name="list" size={20} color="#ADB2D4" />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="absolute bottom-6 right-6"
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-2xl font-bold mb-4">Add New Category</Text>

            <View className="mb-6">
              <Text className="text-gray-600 mb-2 font-medium">
                Category Name
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Enter category name"
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
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
                  Add Category
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
