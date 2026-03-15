import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { useUserStore } from './src/store/userStore';
import { useTheme } from './src/hooks/useTheme';
import { useAppRating } from './src/hooks/useAppRating';

function AppContent() {
  const loadFromStorage = useUserStore(s => s.loadFromStorage);
  const { isDark } = useTheme();
  const { incrementOpenCount } = useAppRating();

  useEffect(() => {
    loadFromStorage();
    incrementOpenCount();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
