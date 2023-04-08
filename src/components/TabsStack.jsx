import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Server from "../screens/Server";
import ServerManage from "../screens/ServerManage";

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
                name="ServerActions"
                component={ ServerManage }
                options={({ route }) => ({ title: route.params.title })}
            />
        </Stack.Navigator>
    );
}

export default ServerTabStack;
