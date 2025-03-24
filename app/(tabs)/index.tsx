import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getCategories, getSpent } from "@/utils/storage";
import { SpendingByCategory } from "@/types";
import GradientHeader from "@/components/GradientHeader";

export default function HomeScreen() {
  const [totalSpent, setTotalSpent] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState<SpendingByCategory[]>(
    []
  );
  const [spendingData, setSpendingData] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const spent = await getSpent();
    const categories = await getCategories();

    const total = spent.reduce((sum, item) => sum + item.amount, 0);
    setTotalSpent(total);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlySpent = spent.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getFullYear() === currentYear
      );
    });

    const spendingByCategory = categories.map((category) => {
      const categoryTotal = monthlySpent
        .filter((item) => item.categoryId === category.id)
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        categoryId: category.id,
        categoryName: category.name,
        total: categoryTotal,
      };
    });

    setMonthlySpending(spendingByCategory);

    const sixMonthsData = Array(6).fill(0);
    spent.forEach((item) => {
      const itemDate = new Date(item.date);
      const monthDiff = currentMonth - itemDate.getMonth();
      if (
        monthDiff >= 0 &&
        monthDiff < 6 &&
        itemDate.getFullYear() === currentYear
      ) {
        sixMonthsData[5 - monthDiff] += item.amount;
      }
    });
    setSpendingData(sixMonthsData);
  };

  return (
    <ScrollView className="flex-1 bg-[#EEF1DA]">
      {/* <GradientHeader header="Dashboard" /> */}
      <LinearGradient
        colors={["#ADB2D4", "#C7D9DD"]}
        className="p-6 rounded-b-3xl"
      >
        <Text className="text-2xl font-bold text-white mb-2">Dashboard</Text>
        <View className="bg-white/90 rounded-xl p-6 mt-2">
          <Text className="text-lg font-medium text-gray-600">Total Spent</Text>
          <Text className="text-4xl font-bold text-[#ADB2D4] mt-1">
            ${totalSpent.toFixed(2)}
          </Text>
        </View>
      </LinearGradient>

      <View className="px-4">
        <View className="bg-white rounded-xl p-4 -mt-4 shadow-lg">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Last 6 Months Spending
          </Text>
          <LineChart
            data={{
              labels: ["5M", "4M", "3M", "2M", "1M"],
              datasets: [
                {
                  data: spendingData,
                },
              ],
            }}
            width={Dimensions.get("window").width - 62}
            height={220}
            chartConfig={{
              backgroundColor: "#ADB2D4",
              backgroundGradientFrom: "#C7D9DD",
              backgroundGradientTo: "#D5E5D5",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <View className="bg-white rounded-xl p-4 mt-4 mb-6 shadow-lg">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Monthly Spending by Category
          </Text>
          {monthlySpending.map((category) => (
            <View
              key={category.categoryId}
              className="flex-row justify-between py-3 border-b border-gray-100"
            >
              <Text className="text-gray-700 font-medium">
                {category.categoryName}
              </Text>
              <Text className="font-bold text-[#ADB2D4]">
                ${category.total.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
