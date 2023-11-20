import React from 'react';
import axios from 'axios';
import { Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Card, ListItem } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../utiles/Colors';

class SingleSeason extends React.Component {
    mainImgWidth = Dimensions.get('window').width;
    mainImgHeight = (Dimensions.get('window').width * 9 / 16);

    localStyle = StyleSheet.create({
        textColor: {
            color: Colors.White
        },
        textLabel: {
            fontWeight: 'bold'
        },
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14,
            color: Colors.PlexYellow
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            season: this.props.route.params.season,
            server: this.props.route.params.server,
            media: this.props.route.params.media,
            episodesList: false,
            spinner: false,
            refreshing: false,
            episodes: this.props.route.params.episodes
        };

        this.refresh = this.refresh.bind(this);
    }

    async updateEpisodes() {
        try {
            const [
                updatedEpisodes
            ] = await Promise.all([
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${this.state.season.key}?X-Plex-Token=${this.state.server.token}`)
            ]);

            this.setState({ episodes: updatedEpisodes.data.MediaContainer.Metadata });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during episodes fetch!');
        }
    };

    refresh() {
        this.setState({ refreshing: true });

        this.updateEpisodes()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    color={Colors.White}
                    textStyle={{
                        color: Colors.White
                    }}
                />

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                    }
                    style={{
                        backgroundColor: Colors.PlexGrey
                    }}
                >
                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
                        <FastImage
                            style={{
                                width: this.mainImgWidth * 0.85,
                                height: this.mainImgHeight * 0.85
                            }}
                            source={{
                                uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${this.state.season.art}?X-Plex-Token=${this.state.server.token}`,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />

                        <Text
                            style={
                                [
                                    {color: Colors.PlexYellow},
                                    this.localStyle.textLabel,
                                ]
                            }
                        >
                            {this.state.media.title} - {this.state.season.title}
                        </Text>
                        <Card.Divider />

                        <Text style={this.localStyle.textColor}>
                            <Text style={this.localStyle.textLabel}>Summary: </Text>
                            {this.state.season.summary}
                        </Text>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={this.localStyle.accordionTitle}>Episodes</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={this.state.episodesList}
                            onPress={() => {
                                this.setState({ episodesList: !this.state.episodesList });
                            }}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack
                            }}
                            icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                        >
                            {this.state.episodes.map((episode, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        onPress={() => {
                                            this.props.navigation.navigate('SingleEpisode', {
                                                title: `${this.state.media.title} - ${this.state.season.title} - ${episode.title}`,
                                                server: this.state.server,
                                                episode: episode
                                            });
                                        }}
                                        containerStyle={{
                                            backgroundColor: Colors.PlexBlack
                                        }}
                                    >
                                        <Avatar
                                            ImageComponent={() => (
                                                <FastImage
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        position: 'absolute'
                                                    }}
                                                    source={{
                                                        uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${episode.thumb}?X-Plex-Token=${this.state.server.token}`,
                                                        priority: FastImage.priority.normal,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                            )}
                                            overlayContainerStyle={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        />

                                        <ListItem.Content>
                                            <ListItem.Title
                                                style={{
                                                    color: Colors.White
                                                }}
                                            >
                                                {episode.title}
                                            </ListItem.Title>

                                            <ListItem.Subtitle
                                                style={{
                                                    color: Colors.White
                                                }}
                                            >
                                                Duration: {episode.duration ? new Date(episode.duration).toISOString().slice(11, 19) : 'unknown'}
                                            </ListItem.Subtitle>
                                        </ListItem.Content>

                                        <ListItem.Chevron color={Colors.White} />
                                    </ListItem>
                                );
                            })}
                        </ListItem.Accordion>
                    </Card>
                </ScrollView>
            </View>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <SingleSeason {...props} navigation={navigation} />;
};
