import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);

  const [destination, setDestination] = useState<
    "/register" | "/login" | "/(tabs)"
  >("/register");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const registered = await AsyncStorage.getItem("registered");
        const loggedIn = await AsyncStorage.getItem("loggedIn");

        if (loggedIn === "true") {
          setDestination("/(tabs)");
        } else if (registered === "true") {
          setDestination("/login");
        } else {
          setDestination("/register");
        }
      } catch (error) {
        console.log("Auth error:", error);
        setDestination("/register");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={destination} />;
}
