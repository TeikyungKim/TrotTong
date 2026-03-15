import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { FavoriteScreen } from '../screens/FavoriteScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

import { useUserStore } from '../store/userStore';
import { useTheme } from '../hooks/useTheme';
import type { RootStackParamList, MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  return (
    <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>{icon}</Text>
  );
}

function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="🏠" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="보관함"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="❤️" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="기록"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="🕐" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="카테고리"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="🎼" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="설정"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, color }) => <TabIcon icon="⚙️" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const hasCompletedOnboarding = useUserStore(s => s.prefs.hasCompletedOnboarding);
  const isLoaded = useUserStore(s => s.isLoaded);
  const { colors } = useTheme();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 40 }}>🎵</Text>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.accent, marginTop: 12 }}>트롯통</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
