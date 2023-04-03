// Dependencies
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// Screens
import Server from '../screens/Server';
import NewServer from '../screens/NewServer';

const Tab = createMaterialBottomTabNavigator();

const Tabs = (): JSX.Element => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Server"
                component={ Server }

            />
            <Tab.Screen
                name="New Server"
                component={ NewServer }
            />
        </Tab.Navigator>
    );
}

export default Tabs;
