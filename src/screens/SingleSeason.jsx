// Dependencies
import React, { useState } from "react";
// Components
import {Dimensions, ScrollView, Text, View} from "react-native";
import { Avatar, Card, ListItem } from "@rneui/themed";
import FastImage from "react-native-fast-image";
import Spinner from "react-native-loading-spinner-overlay";
// Styles
import style from "../style/SingleSeasonStyle"

const SingleSeason = ({ route, navigation }) => {
    const { season, episodes, server, media } = route.params;

    const mainImgWidth = Dimensions.get('window').width;
    const mainImgHeight = (Dimensions.get('window').width * 9 / 16);

    const [ episodesList, setEpisodesList ] = useState(false);
    const [ spinner, setSpinner ] = useState(false);

    return (
        <View>
            <Spinner
                visible={ spinner }
                textContent={'Loading...'}
            />

            <ScrollView>
                <Card>
                    <FastImage
                        style={{
                            width: mainImgWidth * 0.85,
                            height: mainImgHeight * 0.85
                        }}
                        source={{
                            uri: `${server.protocol}://${server.ip}:${server.port}${season.art}?X-Plex-Token=${server.token}`,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={ FastImage.resizeMode.contain }
                    />

                    <Text style={ [style.textColor, style.textLabel] }>{ media.title } - { season.title }</Text>
                    <Card.Divider />

                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Summary : </Text>
                        { season.summary }
                    </Text>
                </Card>

                <Card>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={ [style.accordionTitle] }>Episodes</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={ episodesList }
                        onPress={() => {
                            setEpisodesList(!episodesList)
                        }}
                    >
                        {episodes.map((episode, index) => {
                            return (
                                <ListItem
                                    key={ index }
                                    bottomDivider
                                    onPress={() => {
                                        console.log()

                                        navigation.navigate('SingleEpisode', {
                                            title: `${media.title} - ${season.title} - ${episode.title}`,
                                            server: server,
                                            episode: episode
                                        });
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
                                                    uri: `${server.protocol}://${server.ip}:${server.port}${episode.thumb}?X-Plex-Token=${server.token}`,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode={ FastImage.resizeMode.contain }
                                            />
                                        )}
                                        overlayContainerStyle={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />

                                    <ListItem.Content>
                                        <ListItem.Title>{ episode.title }</ListItem.Title>
                                        <ListItem.Subtitle>Duration : { episode.duration ? new Date(episode.duration).toISOString().slice(11, 19) : 'unknown' }</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem>
                            );
                        })}
                    </ListItem.Accordion>
                </Card>
            </ScrollView>
        </View>
    );
}

export default SingleSeason;
