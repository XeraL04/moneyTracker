import { Tabs } from 'expo-router';
import { Chrome as Home, Layers as Layers3, CirclePlus as PlusCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
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
            <View style={styles.iconContainer}>
              <Home size={size} color={color} {...({} as any)} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add-expense"
        options={{
          title: 'Add Expense',
          headerTitle: 'Add Expense',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <PlusCircle size={size} color={color} {...({} as any)} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          headerTitle: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Layers3 size={size} color={color} {...({} as any)} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    paddingTop: 8,
    paddingBottom: 8,
    height: 80,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
});