import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@rneui/themed';
import axios from 'axios';
import Colors from '../utiles/Colors';

class ServerCapabilities extends React.Component {
    localStyle = StyleSheet.create({
        cardBodyText: {
            color: Colors.White
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            serverCapabilities: this.props.route.params.serverCapabilities,
            server: this.props.route.params.server,
            refresh: false,
        };

        this.refresh = this.refresh.bind(this);
    }

    async fetchServerCapabilities() {
        try {
            let serverCapabilities = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/?X-Plex-Token=${this.state.server.token}`);

            this.setState({ serverCapabilities: serverCapabilities.data.MediaContainer });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong while server capabilities fetch!');
        }
    }

    refresh() {
        this.setState({ refreshing: true });

        this.fetchServerCapabilities()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                }
                style={{
                    backgroundColor: Colors.PlexGrey
                }}
            >
                {Object.keys(this.state.serverCapabilities).map((key, index) => {
                    if (key === 'Directory') {
                        return (
                            <Card
                                key={index}
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack,
                                    borderColor: Colors.White
                                }}
                            >
                                <Card.Title
                                    style={{
                                        color: Colors.PlexYellow
                                    }}
                                >
                                    {key}
                                </Card.Title>

                                <Card.Divider />

                                <View>
                                    {this.state.serverCapabilities[key].map((folder, folderIndex) => {
                                        return (
                                            <Text
                                                key={folderIndex}
                                                style={this.localStyle.cardBodyText}
                                            >
                                                {folder.title}: Count {folder.count} 
                                            </Text>
                                        );
                                    })}
                                </View>
                            </Card>
                        );
                    }

                    if (this.state.serverCapabilities[key] == true || this.state.serverCapabilities[key] == false) {
                        return (
                            <Card
                                key={index}
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack,
                                    borderColor: Colors.White
                                }}
                            >
                                <Card.Title
                                    style={{
                                        color: Colors.PlexYellow
                                    }}
                                >
                                    {key}
                                </Card.Title>

                                <Card.Divider />

                                <View>
                                    <Text
                                        style={this.localStyle.cardBodyText}
                                    >
                                        {this.state.serverCapabilities[key].toString()}
                                    </Text>
                                </View>
                            </Card>
                        );
                    }

                    return (
                        <Card
                            key={index}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack,
                                borderColor: Colors.White
                            }}
                        >
                            <Card.Title
                                style={{
                                    color: Colors.PlexYellow
                                }}
                            >
                                {key}
                            </Card.Title>

                            <Card.Divider />

                            <View>
                                <Text
                                    style={this.localStyle.cardBodyText}
                                >
                                    {this.state.serverCapabilities[key]}
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
    return <ServerCapabilities {...props} navigation={navigation} />
}
