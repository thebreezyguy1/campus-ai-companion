import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatScreen from '../screens/ChatScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
                const icons = {
                    Chat: 'chatbubble-outline',
                    History: 'time-outiline',
                    Settings: 'settings-outline',
                };
                return <Ionicons name={icons[route.name]} size={size} color={color} />
            },
            tabBarActiveTintColor: '#4F46E5',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
        })}>
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator> 
    );
}