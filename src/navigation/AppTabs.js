import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from "../screens/ChatScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import EditCoursesScreen from "../screens/EditCoursesScreen";
import EditProfileScreen from "../screens/editProfileScreen";

const Tab = createBottomTabNavigator();
const SettingsStack = createStackNavigator();

const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} />
      <SettingsStack.Screen name="EditCourses" component={EditCoursesScreen} />
      <SettingsStack.Screen name="EditProfile" component={EditProfileScreen} />
    </SettingsStack.Navigator>
  );
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Chat: "chatbubble-outline",
            History: "time-outline",
            Settings: "settings-outline",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#4F46E5",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
}
