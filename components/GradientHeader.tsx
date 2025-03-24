import { Text } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const GradientHeader = ({ header }: { header: string }) => {
  return (
    <LinearGradient
      colors={["#ADB2D4", "#C7D9DD"]}
      className="w-full m-6 p-6 rounded-b-3xl"
    >
      <Text className="text-xl font-bold text-gray text-center">{header}</Text>
    </LinearGradient>
  );
};

export default GradientHeader;
