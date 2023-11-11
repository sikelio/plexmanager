import React from 'react';
import { StyleSheet, View } from "react-native";
import { Text, Card, Switch } from '@rneui/themed';
import { saveDarkmode } from "../functions/Darkmode";

class Settings extends React.Component {
    localStyle = StyleSheet.create({
        container: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            marginVertical: 2.5
        },
        item: {
            width: '85%',
            fontSize: 18
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            darkmode: false
        };
    }

    render() {
        return (
            <View>
                <Card>
                    <View
                        style={this.localStyle.container}
                    >
                        <Text
                            style={this.localStyle.item}
                        >
                            Darkmode
                        </Text>

                        <Switch
                            value={this.state.darkmode}
                            onValueChange={async (value) => {
                                this.setState({ darkmode: value });

                                await saveDarkmode(value);
                            }}
                        />
                    </View>
                </Card>
            </View>
        );
    }
}

export default Settings;
