import React from 'react';
import { Text, ScrollView, View, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';
import {
    getPreferenceGroupName,
    getPreferenceLabel,
    getPreferenceSummary,
    getPreferenceValue
} from '../functions/ServerManageUtiles';
import { useNavigation } from '@react-navigation/native';

class ServerPreferences extends React.Component {
    localStyle = StyleSheet.create({
        cardBodyText: {
            color: '#000'
        }
    });

    constructor(props) {
        super(props)

        this.state = {
            preferences: this.props.route.params.preferences
        };
    }

    render() {
        return (
            <ScrollView>
                {this.state.preferences.map((preference, index) => {
                    return (
                        <Card key={index}>
                            <Card.Title>{getPreferenceLabel(preference)}</Card.Title>
                            <Card.Divider />
                            <View>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    Summary: {getPreferenceSummary(preference)}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    Group: {getPreferenceGroupName(preference)}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    Value: {getPreferenceValue(preference)}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    Advanced: {preference.advanced.toString()}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    Hidden: {preference.hidden.toString()}
                                </Text>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <ServerPreferences {...props} navigation={navigation} />;
};
