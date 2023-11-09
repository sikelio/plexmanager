import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';

class SingleEpisode extends React.Component {
    mainImgWidth = Dimensions.get('window').width;
    mainImgHeight = (Dimensions.get('window').width * 9 / 16);

    localStyle = StyleSheet.create({
        textColor: {
            color: '#000'
        },
        textLabel: {
            fontWeight: 'bold'
        },
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            server: this.props.route.params.server,
            episode: this.props.route.params.episode
        };
    }

    render() {
        return (
            <ScrollView>
                <Card>
                    <View>
                        <FastImage
                            style={{
                                width: this.mainImgWidth * 0.85,
                                height: this.mainImgHeight * 0.85
                            }}
                            source={{
                                uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${this.state.episode.thumb}?X-Plex-Token=${this.state.server.token}`,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>

                    <Text style={[this.localStyle.textColor, this.localStyle.textLabel]}>{this.state.episode.title}</Text>
                    <Card.Divider />

                    <Text style={this.localStyle.textColor}>
                        <Text style={this.localStyle.textLabel}>Summary: </Text>
                        {this.state.episode.summary}
                    </Text>

                    <Text style={this.localStyle.textColor}>
                        <Text style={this.localStyle.textLabel}>Duration: </Text>
                        {this.state.episode.duration ? new Date(this.state.episode.duration).toISOString().slice(11, 19) : 'unknown'}
                    </Text>
                </Card>
            </ScrollView>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <SingleEpisode {...props} navigation={navigation} />;
};
