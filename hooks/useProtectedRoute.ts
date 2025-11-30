
import { useRootNavigationState, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!navigationState?.key) return;

      const isLoginScreen = segments.length === 0;
      const token = await AsyncStorage.getItem("user-token");

      if (!token && !isLoginScreen) {
        router.replace("/");
      } else if (token && isLoginScreen) {
        router.replace("/home");
      }
      setIsNavigationReady(true);
    };

    checkAuth();
  }, [segments, navigationState]);

  return isNavigationReady;
}
