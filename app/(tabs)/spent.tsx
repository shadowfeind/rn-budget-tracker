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
import { Category, Spent } from "@/types";
import { getCategories, getSpent, saveSpent } from "@/utils/storage";

export default function SpentScreen() {
  const [spentItems, setSpentItems] = useState<Spent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const spentData = await getSpent();
    const categoriesData = await getCategories();
    setSpentItems(
      spentData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
    setCategories(categoriesData);
  };

  const handleAddSpent = async () => {
    if (!selectedCategory || !amount || isNaN(Number(amount))) {
      toast.error("Please fill all fields correctly");
      return;
    }

    const newSpent: Spent = {
      id: Date.now().toString(),
      categoryId: selectedCategory,
      amount: Number(amount),
      date: new Date().toISOString(),
      remarks,
    };

    await saveSpent(newSpent);
    setModalVisible(false);
    setSelectedCategory("");
    setAmount("");
    setRemarks("");
    loadData();
    toast.success("Spent added successfully");
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown";
  };

  return (
    <View className="flex-1 bg-[#EEF1DA]">
      <LinearGradient
        colors={["#ADB2D4", "#C7D9DD"]}
        className="p-6 rounded-b-3xl"
      >
        <Text className="text-2xl font-bold text-white">Spent History</Text>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 -mt-4">
        {spentItems.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl p-4 mb-3 shadow-lg"
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl font-bold text-[#ADB2D4]">
                ${item.amount.toFixed(2)}
              </Text>
              <View className="bg-[#EEF1DA] px-3 py-1 rounded-full">
                <Text className="text-[#ADB2D4] font-medium">
                  {getCategoryName(item.categoryId)}
                </Text>
              </View>
            </View>
            <Text className="text-gray-500 mt-2">
              {new Date(item.date).toLocaleDateString()}
            </Text>
            {item.remarks && (
              <Text className="text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                {item.remarks}
              </Text>
            )}
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
            <Text className="text-2xl font-bold mb-4">Add New Spent</Text>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-medium">Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row gap-2"
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category.id
                        ? "bg-[#ADB2D4]"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={
                        selectedCategory === category.id
                          ? "text-white font-medium"
                          : "text-gray-700"
                      }
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-medium">Amount</Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2 font-medium">
                Remarks (Optional)
              </Text>
              <TextInput
                className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                value={remarks}
                onChangeText={setRemarks}
                placeholder="Add remarks"
                multiline
                numberOfLines={3}
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
                onPress={handleAddSpent}
                className="flex-1 p-4 rounded-xl"
                style={{
                  backgroundColor: "#ADB2D4",
                }}
              >
                <Text className="text-center text-white font-medium">
                  Add Spent
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
