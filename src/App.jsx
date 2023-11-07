// Dependencies
import React from 'react';
// Components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from './components/Tabs';
// Screens
import SingleServer from "./screens/SingleServer";
import EditServer from "./screens/EditServer";
import SingleSession from "./screens/SingleSession";
import SingleAccount from "./screens/SingleAccount";
import ServerPreferences from "./screens/ServerPreferences";
import SingleLibrary from "./screens/SingleLibrary";
import SingleMedia from "./screens/SingleMedia";
import ScheduledTasks from "./screens/ScheduledTasks";
import SingleSeason from "./screens/SingleSeason";
import SingleEpisode from "./screens/SingleEpisode";

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name='Server'
                        component={ Tabs }
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SingleServer"
                        component={ SingleServer }
                        options={({ route }) => ({ title: route.params.title })}
                    />
                    <Stack.Screen
                        name="EditServer"
                        component={ EditServer }
                        options={({ route }) => ({ title: `Edit ${route.params.title}` })}
                    />
                    <Stack.Screen
                        name="SingleSession"
                        component={ SingleSession }
                        options={({ route }) => ({ title: `Manage session - ${route.params.title}` })}
                    />
                    <Stack.Screen
                        name="SingleAccount"
                        component={ SingleAccount }
                        options={({ route }) => ({ title: `User : ${route.params.title}` })}
                    />
                    <Stack.Screen
                        name="ServerPreferences"
                        component={ ServerPreferences }
                        options={({ route }) => ({ title: `Server Preferences` })}
                    />
                    <Stack.Screen
                        name="SingleLibrary"
                        component={ SingleLibrary }
                        options={({ route }) => ({ title: `Library : ${route.params.title}` })}
                    />
                    <Stack.Screen
                        name="SingleMedia"
                        component={ SingleMedia }
                        options={({ route }) => ({ title: route.params.title })}
                    />
                    <Stack.Screen
                        name="ScheduledTasks"
                        component={ ScheduledTasks }
                        options={({ route }) => ({ title: 'Scheduled tasks' })}
                    />
                    <Stack.Screen
                        name="SingleSeason"
                        component={ SingleSeason }
                        options={({ route }) => ({ title: route.params.title })}
                    />
                    <Stack.Screen
                        name="SingleEpisode"
                        component={ SingleEpisode }
                        options={({ route }) => ({ title: route.params.title })}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
