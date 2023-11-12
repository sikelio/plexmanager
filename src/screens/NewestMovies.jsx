import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Avatar, Card, ListItem } from "@rneui/themed";
import axios from "axios";
import FastImage from "react-native-fast-image";

class NewestMovies extends React.Component {
    localStyle = StyleSheet.create({
        libraryContainer: {
            flex: 1
        },
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
        },
        upperContainer: {
            marginBottom: 10
        },
        bottomContainer: {
            marginTop: 20
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            movies: this.props.route.params.movies,
            newestMoviesList: true,
            server: this.props.route.params.server,
            refreshing: false,
            libraryKey: this.props.route.params.libraryKey
        };

        this.refresh = this.refresh.bind(this);
    }

    async fetchNewestMovies() {
        try {
            const [
                updatedNewestMovies
            ] = await Promise.all([
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/${this.state.libraryKey}/newest?X-Plex-Token=${this.state.server.token}`)
            ]);

            this.setState({ movies: updatedNewestMovies.data.MediaContainer.Metadata });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during the library fetch!');
        }
    }

    refresh() {
        this.setState({ refreshing: true });

        this.fetchNewestMovies()
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
            >
                <Card>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={this.localStyle.accordionTitle}>Newest movies</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={this.state.newestMoviesList}
                        onPress={() => {
                            this.setState({ newestMoviesList: !this.state.newestMoviesList });
                        }}
                    >
                        {this.state.movies.map((movie, index) => {
                            return (
                                <ListItem
                                    key={index}
                                    bottomDivider
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
                                                    uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${movie.thumb}?X-Plex-Token=${this.state.server.token}`,
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
                                        <ListItem.Title>{movie.title}</ListItem.Title>
                                        <ListItem.Subtitle>{movie.studio}</ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            );
                        })}
                    </ListItem.Accordion>
                </Card>
            </ScrollView>
        );
    }
}

export default (props) => {
  const navigation = useNavigation();
  return <NewestMovies {...props} navigation={navigation} />;
};
