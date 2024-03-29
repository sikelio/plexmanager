import React from 'react';
import axios from 'axios';
import { Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Card, ListItem } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import { getDateFromTimestamp, getTimeFromTimestamp } from '../functions/GlobalUtiles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Colors from '../utiles/Colors';

class SingleMedia extends React.Component {
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
            library: this.props.route.params.library,
            server: this.props.route.params.server,
            seasonsList: true,
            spinner: false,
            refreshing: false,
            media: this.props.route.params.media,
            seasons: this.props.route.params.seasons
        };

        this.refresh = this.refresh.bind(this);
    }

    async updateMedia () {
        try {
            const [
                updatedSeasons
            ] = await Promise.all([
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${this.state.media.key}?X-Plex-Token=${this.state.server.token}`)
            ]);

            this.setState({ seasons: updatedSeasons.data.MediaContainer.Metadata });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during the seasons fetch!');
        }
    };

    refresh() {
        this.setState({ refreshing: true });

        this.updateMedia()
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
                        <View>
                            <FastImage
                                style={{
                                    width: this.mainImgWidth * 0.85,
                                    height: this.mainImgHeight * 0.85
                                }}
                                source={{
                                    uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${this.state.media.art}?X-Plex-Token=${this.state.server.token}`,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />

                            <Text
                                style={
                                    [
                                        {color: Colors.PlexYellow},
                                        this.localStyle.textLabel
                                    ]
                                }
                            >
                                {this.state.media.title} {this.state.media.studio ? `- ${this.state.media.studio}` : ''}
                            </Text>

                            <Card.Divider />

                            <Text style={this.localStyle.textColor}>
                                <Text style={this.localStyle.textLabel}>Summary: </Text>
                                {this.state.media.summary}
                            </Text>

                            <Text style={this.localStyle.textColor}>
                                <Text style={this.localStyle.textLabel}>Duration: </Text>
                                {this.state.media.duration ? new Date(this.state.media.duration).toISOString().slice(11, 19) : 'unknown'}
                            </Text>

                            <Text style={this.localStyle.textColor}>
                                <Text style={this.localStyle.textLabel}>Rating: </Text>
                                {this.state.media.rating ? this.state.media.rating : 'unknown'}
                            </Text>

                            <Text style={this.localStyle.textColor}>
                                <Text style={this.localStyle.textLabel}>Added at: </Text>
                                {getDateFromTimestamp(this.state.media.addedAt)} - {getTimeFromTimestamp(this.state.media.addedAt)}
                            </Text>
                        </View>
                    </Card>

                    {this.state.library.type === 'show' ? (
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Seasons</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.seasonsList}
                                onPress={() => {
                                    this.setState({ seasonsList: !this.state.seasonsList });
                                }}
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                {this.state.seasons.map((season, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            onPress={async () => {
                                                try {
                                                    this.setState({ spinner: true });

                                                    let episodes = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${season.key}?X-Plex-Token=${this.state.server.token}`);

                                                    this.props.navigation.navigate('SingleSeason', {
                                                        title: `${this.state.media.title} - ${season.title}`,
                                                        season: season,
                                                        episodes: episodes.data.MediaContainer.Metadata,
                                                        server: this.state.server,
                                                        media: this.state.media
                                                    });

                                                    this.setState({ spinner: false });
                                                } catch (e) {
                                                    Alert.alert('Error', 'Something went wrong during episodes fetch!');
                                                }
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
                                                            uri: `${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}${season.thumb}?X-Plex-Token=${this.state.server.token}`,
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
                                                    {season.title}
                                                </ListItem.Title>

                                                <ListItem.Subtitle
                                                    style={{
                                                        color: Colors.White
                                                    }}
                                                >
                                                    {season.year ? season.year : season.parentYear}
                                                </ListItem.Subtitle>
                                            </ListItem.Content>
                                            <ListItem.Chevron color={Colors.White} />
                                        </ListItem>
                                    )
                                })}
                            </ListItem.Accordion>
                        </Card>
                    ) : (
                        <Text></Text>
                    )}
                </ScrollView>
            </View>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <SingleMedia {...props} navigation={navigation} />;
};
