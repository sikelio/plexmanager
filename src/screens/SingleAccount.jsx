import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import { getCountryFlag } from '../functions/SingleAccountUtilities';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utiles/Colors';

class SingleAccount extends React.Component {
    localStyle = StyleSheet.create({
        textColor: {
            color: Colors.White,
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
            <ScrollView
                style={{
                    backgroundColor: Colors.PlexGrey
                }}
            >
                <Card
                    containerStyle={{
                        backgroundColor: Colors.PlexBlack
                    }}
                >
                    <Card.Title
                        style={{
                            color: Colors.PlexYellow
                        }}
                    >
                        {this.state.userDetails.name}
                    </Card.Title>

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
