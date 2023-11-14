import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NewServer from '../screens/NewServer';
import Servers from "../screens/Servers";
import About from "../screens/About";
import Colors from '../utiles/Colors';

const Tab = createMaterialBottomTabNavigator();

class Tabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Tab.Navigator
                activeColor={Colors.PlexYellow}
                inactiveColor={Colors.White}
                initialRouteName={'Servers'}
                barStyle={{
                    backgroundColor: Colors.PlexBlack,
                }}
            >
                <Tab.Screen
                    name={'Servers'}
                    component={Servers}
                    options={{
                        tabBarLabel: 'Servers',
                        tabBarIcon: ({focused, color}) => (
                            <Icon name={'server'} color={focused ? Colors.PlexYellow : Colors.White} size={16} />
                        )
                    }}
                />

                <Tab.Screen
                    name={'New Server'}
                    component={NewServer}
                    options={{
                        tabBarLabel: 'New Server',
                        tabBarIcon: ({focused, color}) => (
                            <Icon name={'plus'} color={focused ? Colors.PlexYellow : Colors.White} size={16} />
                        )
                    }}
                />

                <Tab.Screen
                    name={'About'}
                    component={About}
                    options={{
                        tabBarLabel: 'About',
                        tabBarIcon: ({focused, color}) => (
                            <Icon name={'info'} color={focused ? Colors.PlexYellow : Colors.White} size={16} />
                        )
                    }}
                />
            </Tab.Navigator>
        );
    }
}

export default Tabs;
