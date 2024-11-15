import React from "react";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";
import { HeartIcon } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pokedex",
          headerRight: () => (
            <Link href="./favorite" asChild>
              <Pressable style={{ marginRight: 16 }}>
                <HeartIcon size={24} color="black" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="[name]" options={{ title: "Pokemon Detail" }} />
      <Stack.Screen name="favorite" options={{ title: "Favorite Pokemon" }} />
    </Stack>
  );
}
