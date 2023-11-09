import React from 'react';
import axios from 'axios';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Button, ListItem, Avatar } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import { sendPutRequest, sendRequest } from '../functions/ServerRequest';
import { useNavigation } from '@react-navigation/native';

class SingleLibrary extends React.Component {
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
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            library: this.props.route.params.library,
            server: this.props.route.params.server,
            mediaList: false,
            spinner: false,
            refreshing: false,
            medias: this.props.route.params.medias
        };

        this.refresh = this.refresh.bind(this);
    }

    async updateLibrary() {
        try {
            const [
                updatedMedias
            ] = await Promise.all([
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/${this.state.library.key}/all?X-Plex-Token=${this.state.server.token}`)
            ]);

            this.setState({ medias: updatedMedias.data.MediaContainer.Metadata });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during the library fetch!');
        }
    }

    refresh() {
        this.setState({ refreshing: true });

        this.updateLibrary()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        return (
            <View style={this.localStyle.libraryContainer}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                    }
                >
                    <Card>
                        <Card.Title>Actions</Card.Title>
                        <Card.Divider />
                        <View style={[this.localStyle.container, this.localStyle.upperContainer]}>
                            <Button
                                title='Scan'
                                containerStyle={{
                                    width: '48%'
                                }}
                                buttonStyle={{
                                    backgroundColor: '#e5a00d'
                                }}
                                onPress={() => {
                                    sendRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/${this.state.library.key}/refresh?X-Plex-Token=${this.state.server.token}`);
                                }}
                            />

                            <Button
                                title='Metadata'
                                containerStyle={{
                                    width: '48%'
                                }}
                                buttonStyle={{
                                    backgroundColor: '#e5a00d'
                                }}
                                onPress={() => {
                                    sendRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/${this.state.library.key}/refresh?force=1&X-Plex-Token=${this.state.server.token}`);
                                }}
                            />
                        </View>

                        <View style={this.localStyle.container}>
                            <Button
                                title='Empty Trash'
                                containerStyle={{
                                    width: '100%'
                                }}
                                buttonStyle={{
                                    backgroundColor: '#e5a00d'
                                }}
                                onPress={() => {
                                    sendPutRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/${this.state.library.key}/emptyTrash?X-Plex-Token=${this.state.server.token}`);
                                }}
                            />
                        </View>
                    </Card>

                    <Card>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={this.localStyle.accordionTitle}>Medias</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={this.state.mediaList}
                            onPress={() => {
                                this.setState({ mediaList: !this.state.mediaList });
                            }}
                        >
                            {this.state.medias.map((media, index) => {
                                return (
                                    <ListItem
                                        key={index}
                                        bottomDivider
                                        onPress={async () => {
                                            this.setState({ spinner: true });

                                            if (this.state.library.type !== 'show') {

                                                return this.props.navigation.navigate('SingleMedia', {
                                                    title: media.title,
                                                    library: this.state.library,
                                                    media: media,
                                                    server: this.state.server
                                                });
                                            }

                                            try {
                                                let seasons = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${media.key}?X-Plex-Token=${this.state.server.token}`);

                                                this.props.navigation.navigate('SingleMedia', {
                                                    title: media.title,
                                                    library: this.state.library,
                                                    media: media,
                                                    server: this.state.server,
                                                    seasons: seasons.data.MediaContainer.Metadata
                                                });

                                                this.setState({ spinner: false });
                                            } catch (e) {
                                                Alert.alert('Error', 'Something went wrong while fetching the TV show seasons!');
                                            }
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
                                                        uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${media.thumb}?X-Plex-Token=${this.state.server.token}`,
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
                                            <ListItem.Title>{media.title}</ListItem.Title>
                                            <ListItem.Subtitle>{media.studio}</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron color='black' />
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
    return <SingleLibrary {...props} navigation={navigation} />;
};
