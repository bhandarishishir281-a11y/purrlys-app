import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const tabItems = [
  { name: 'index', title: 'Dashboard', icon: 'square.grid.2x2.fill' },
  { name: 'health-tracking', title: 'Health Tracking', icon: 'heart.circle.fill' },
  { name: 'achievements', title: 'Achievements', icon: 'rosette' },
  { name: 'vip-features', title: 'VIP Features', icon: 'crown.fill' },
  { name: 'notifications', title: 'Notifications', icon: 'bell.badge.fill' },
  { name: 'pet-profile', title: 'Pet Profile', icon: 'person.crop.circle' },
] as const;

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      {tabItems.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={24} name={tab.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
