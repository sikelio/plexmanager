// Dependencies
import React from 'react';
// Components
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
// Screens
import NewServer from '../screens/NewServer';
import Server from "../screens/Server";

const Tab = createMaterialBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Servers"
                component={ Server }
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon name={ 'server' } color={ color } size={ 16 } />
                    ),
                }}
            />
            <Tab.Screen
                name="New Server"
                component={ NewServer }
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Icon name={ 'plus' } color={ color } size={ 16 } />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default Tabs;
