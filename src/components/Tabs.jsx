import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NewServer from '../screens/NewServer';
import Servers from "../screens/Servers";
import About from "../screens/About";

const Tab = createMaterialBottomTabNavigator();

class Tabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tab.Navigator>
                <Tab.Screen
                    name={'Servers'}
                    component={Servers}
                    options={{
                        tabBarIcon: ({focused, color}) => (
                            <Icon name={'server'} color={color} size={16} />
                        ),
                    }}
                />
                <Tab.Screen
                    name={'New Server'}
                    component={NewServer}
                    options={{
                        tabBarIcon: ({focused, color}) => (
                            <Icon name={'plus'} color={color} size={16} />
                        )
                    }}
                />
                <Tab.Screen
                    name={'About'}
                    component={About}
                    options={{
                        tabBarIcon: ({focused, color}) => (
                            <Icon name={'info'} color={color} size={16} />
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

export default Tabs;
