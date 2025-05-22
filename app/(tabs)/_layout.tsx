import { Box } from '@gluestack-ui/themed';
import { Tabs } from 'expo-router';
import { House as Home, Layers as Layers3, CirclePlus as PlusCircle } from 'lucide-react-native';

export default function TabLayout() {
  // Using gluestack-ui design tokens
  const activeColor = '#007AFF'; // or useToken('colors', 'blue600')
  const inactiveColor = '#8E8E93'; // or useToken('colors', 'coolGray500')
  const backgroundColor = '#FFFFFF'; // or useToken('colors', 'white')
  const borderColor = '#EFEFEF'; // or useToken('colors', 'coolGray200')

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginBottom: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
          color: '#000000',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          headerTitle: 'Expense Tracker',
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center" justifyContent="center">
              <Home size={size} color={color} />
            </Box>
          ),
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: 'Add Expense',
          headerTitle: 'Add Expense',
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center" justifyContent="center">
              <PlusCircle size={size} color={color} />
            </Box>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerTitle: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Box alignItems="center" justifyContent="center">
              <Layers3 size={size} color={color} />
            </Box>
          ),
        }}
      />
    </Tabs>
  );
}