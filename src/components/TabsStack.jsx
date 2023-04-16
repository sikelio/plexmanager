// Dependencies
import React from "react";
// Components
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Screens
import Server from "../screens/Server";
import ServerManage from "../screens/ServerManage";
import EditServer from "../screens/EditServer";
import SessionManage from "../screens/SessionManage";

const Stack = createNativeStackNavigator();

const ServerTabStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Server"
                component={ Server }
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ServerManage"
                component={ ServerManage }
                options={({ route }) => ({ title: route.params.title })}
            />
            <Stack.Screen
                name="EditServer"
                component={ EditServer }
                options={({ route }) => ({ title: `Edit ${route.params.title}` })}
            />
            <Stack.Screen
                name="SessionManage"
                component={ SessionManage }
                options={({ route }) => ({ title: `Manage session - ${route.params.title}` })}
            />
        </Stack.Navigator>
    );
}

export default ServerTabStack;
