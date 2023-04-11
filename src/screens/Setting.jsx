// Dependencies
import React, { useState, useEffect } from 'react';
// Components
import {Alert, View} from 'react-native';
import { Text, Card, Switch } from '@rneui/themed';
// Functions
import { saveDarkmode, getDarkmodeSwitch } from "../functions/Darkmode";
// Styles
import style from '../style/SettingStyle';

const Setting = () => {
    const [ darkmode, setDarkmode ] = useState(false);

    useEffect(() => {
        getDarkmodeSwitch(setDarkmode);
    });

    return (
        <View>
            <Card>
                <View
                    style={ [style.container] }
                >
                    <Text
                        style={ [style.item] }
                    >
                        Darkmode
                    </Text>

                    <Switch
                        value={ darkmode }
                        onValueChange={async (value) => {
                            setDarkmode(value);
                            await saveDarkmode(value);
                        }}
                    />
                </View>
            </Card>
        </View>
    );
}

export default Setting;
