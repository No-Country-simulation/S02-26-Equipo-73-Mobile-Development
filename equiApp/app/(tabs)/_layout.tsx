import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AntDesignIcon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <AntDesignIcon name="shopping-cart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="closet"
        options={{
          title: 'Closet',
          tabBarIcon: ({ color }) => <AntDesignIcon name="appstore" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // tabBarIcon: ({ color }) => <AntDesignIcon name="user" size={24} color={color} />,
          href: null
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <AntDesignIcon name="setting" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

// Componente simple de icono (puedes usar @expo/vector-icons)
function TabBarIcon({ name: any, color }: { name: string; color: string }) {
  // Aquí puedes usar Ionicons u otro set de iconos
  // import { Ionicons } from '@expo/vector-icons';
  // return <Ionicons name={name} size={24} color={color} />;
  return null;
}
