import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, useColorScheme, View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AntDesignIcon from '@expo/vector-icons/AntDesign';
import { Colors } from '@/src/constants';
import { useCart } from '@/src/stores/cart.store';

function CartIconWithBadge({ color }: { color: string }) {
  const { summary } = useCart();
  
  return (
    <View style={{ width: 24, height: 24 }}>
      <AntDesignIcon name="shopping-cart" size={24} color={color} />
      {summary.itemsCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {summary.itemsCount > 99 ? '99+' : summary.itemsCount}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
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
          title: t('navigation.home'),
          tabBarIcon: ({ color }) => <AntDesignIcon name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t('navigation.shop'),
          tabBarIcon: ({ color }) => <AntDesignIcon name="shopping-cart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('navigation.cart'),
          tabBarIcon: ({ color }) => <CartIconWithBadge color={color} />,
        }}
      />
      <Tabs.Screen
        name="(fitting)"
        options={{
          title: t('navigation.fitting'),
          tabBarIcon: ({ color }) => <AntDesignIcon name="appstore" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color }) => <AntDesignIcon name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});