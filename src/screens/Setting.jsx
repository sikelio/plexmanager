// Dependencies
import React from 'react';
// Components
import { Text, View } from 'react-native';
// Styles
import style from '../style/SettingStyle';

const Setting = () => {
    return (
        <View
            style={ [style.container] }
        >
            <Text
                style={ [style.item] }
            >
                Hello
            </Text>

            <Text
                style={ [style.item] }
            >
                Hello
            </Text>
        </View>
    );
}

export default Setting;
