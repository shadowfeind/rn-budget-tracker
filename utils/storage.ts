import AsyncStorage from "@react-native-async-storage/async-storage";
import { Category, Spent } from "../types";

const CATEGORIES_KEY = "budget_categories";
const SPENT_KEY = "budget_spent";

export const saveCategory = async (category: Category) => {
  try {
    const existingCategories = await getCategories();
    const updatedCategories = [...existingCategories, category];
    await AsyncStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(updatedCategories)
    );
  } catch (error) {
    console.error("Error saving category:", error);
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const categories = await AsyncStorage.getItem(CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [];
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

export const saveSpent = async (spent: Spent) => {
  try {
    const existingSpent = await getSpent();
    const updatedSpent = [...existingSpent, spent];
    await AsyncStorage.setItem(SPENT_KEY, JSON.stringify(updatedSpent));
  } catch (error) {
    console.error("Error saving spent:", error);
  }
};

export const getSpent = async (): Promise<Spent[]> => {
  try {
    const spent = await AsyncStorage.getItem(SPENT_KEY);
    return spent ? JSON.parse(spent) : [];
  } catch (error) {
    console.error("Error getting spent:", error);
    return [];
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const existingCategories = await getCategories();
    const updatedCategories = existingCategories.filter(
      (category) => category.id !== categoryId
    );
    await AsyncStorage.setItem(
      CATEGORIES_KEY,
      JSON.stringify(updatedCategories)
    );
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};
