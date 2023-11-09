import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import { getCountryFlag } from '../functions/SingleAccountUtilities';
import { useNavigation } from '@react-navigation/native';

class SingleAccount extends React.Component {
    localStyle = StyleSheet.create({
        userPreferencesLabel: {
            width: '50%',
            color: '#000000'
        },
        userPreferencesValue: {
            width: '50%',
            color: '#000000'
        },
        textColor: {
            color: '#000',
            marginBottom: 10
        },
        textLabel: {
            fontWeight: 'bold'
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            userDetails: this.props.route.params.userDetails
        };
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <Card.Title>{this.state.userDetails.name}</Card.Title>
                    <Card.Divider />
                    <View>
                        <Text style={this.localStyle.textColor}>
                            <Text style={this.localStyle.textLabel}>Auto select audio: </Text>
                            {this.state.userDetails.autoSelectAudio.toString()}
                        </Text>
                        <Text style={this.localStyle.textColor}>
                            <Text style={this.localStyle.textLabel}>Default audio language: </Text>
                            <FastImage
                                style={{
                                    width: 16,
                                    height: 12,
                                    alignSelf: 'center'
                                }}
                                source={{
                                    uri: getCountryFlag(this.state.userDetails.defaultAudioLanguage)
                                }}
                            />
                        </Text>
                        <Text style={this.localStyle.textColor}>
                            <Text style={this.localStyle.textLabel}>Default subtitle language: </Text>
                            <FastImage
                                style={{
                                    width: 16,
                                    height: 12,
                                    alignSelf: 'center'
                                }}
                                source={{
                                    uri: getCountryFlag(this.state.userDetails.defaultSubtitleLanguage)
                                }}
                            />
                        </Text>
                        <Text style={this.localStyle.textColor}>
                            <Text style={this.localStyle.textLabel}>Subtitle mode: </Text>
                            <Text>{this.state.userDetails.subtitleMode}</Text>
                        </Text>
                    </View>
                </Card>
            </ScrollView>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <SingleAccount {...props} navigation={navigation} />;
};
