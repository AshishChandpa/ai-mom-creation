
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
      console.log("useProtectedRoute: checkAuth started");
      console.log("useProtectedRoute: navigationState?.key", navigationState?.key);

      if (!navigationState?.key) {
        console.log("useProtectedRoute: navigationState?.key not ready, returning");
        return;
      }

      const isLoginScreen = segments.length === 0;
      console.log("useProtectedRoute: isLoginScreen", isLoginScreen);

      let token = null;
      try {
        token = await AsyncStorage.getItem("user-token");
        console.log("useProtectedRoute: token", token ? "exists" : "null");
      } catch (error) {
        console.error("useProtectedRoute: Error getting token from AsyncStorage", error);
      }
      

      if (!token && !isLoginScreen) {
        console.log("useProtectedRoute: No token and not on login screen, redirecting to /");
        router.replace("/");
      } else if (token && isLoginScreen) {
        console.log("useProtectedRoute: Token exists and on login screen, redirecting to /home");
        router.replace("/home");
      }
      console.log("useProtectedRoute: Setting isNavigationReady to true");
      setIsNavigationReady(true);
    };

    checkAuth();
  }, [segments, navigationState]);

  return isNavigationReady;
}
