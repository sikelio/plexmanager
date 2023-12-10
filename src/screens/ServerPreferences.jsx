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
import Colors from '../utiles/Colors';

class ServerPreferences extends React.Component {
    localStyle = StyleSheet.create({
        cardBodyText: {
            color: Colors.White
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
            <ScrollView
                style={{
                    backgroundColor: Colors.PlexGrey
                }}
            >
                {this.state.preferences.map((preference, index) => {
                    return (
                        <Card
                            key={index}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack,
                                borderColor: Colors.White,
                                borderWidth: 1
                            }}
                        >
                            <Card.Title
                                style={{
                                    color: Colors.PlexYellow
                                }}
                            >
                                {getPreferenceLabel(preference)}
                            </Card.Title>

                            <Card.Divider />

                            <View>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Summary:
                                    </Text> {getPreferenceSummary(preference)}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Group:
                                    </Text> {getPreferenceGroupName(preference)}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Value:
                                    </Text> {getPreferenceValue(preference)}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Advanced:
                                    </Text> {preference.advanced.toString()}
                                </Text>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    <Text
                                        style={{
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Hidden:
                                    </Text> {preference.hidden.toString()}
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
