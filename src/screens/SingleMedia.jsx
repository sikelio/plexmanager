// Dependencies
import React, {useCallback, useState} from "react";
import axios from "axios";
// Components
import { Dimensions, RefreshControl, ScrollView, Text, View } from "react-native";
import { Avatar, Card, ListItem } from "@rneui/themed";
import FastImage from "react-native-fast-image";
import Spinner from "react-native-loading-spinner-overlay";
// Functions
import { getDateFromTimestamp, getTimeFromTimestamp } from "../functions/GlobalUtiles";
// Styles
import style from "../style/SingleMediaStyle";

const SingleMedia = ({ route, navigation }) => {
    const { library, server } = route.params;

    const [ seasonsList, setSeasonsList ] = useState(false);
    const [ spinner, setSpinner ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);

    const [ media, setMedia ] = useState(route.params.media);
    const [ seasons, setSeasons ] = useState(route.params.seasons);


    const mainImgWidth = Dimensions.get('window').width;
    const mainImgHeight = (Dimensions.get('window').width * 9 / 16);

    const updateMedia = async () => {
        try {
            const [
                updatedSeasons
            ] = await Promise.all([
                axios.get(`${server.protocol}://${server.ip}:${server.port}${media.key}?X-Plex-Token=${server.token}`)
            ]);

            setSeasons(updatedSeasons.data.MediaContainer.Metadata);
        } catch (e) {}
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        updateMedia().finally(() => {
            setRefreshing(false);
        });
    }, []);

    return (
        <View>
            <Spinner
                visible={ spinner }
                textContent={'Loading...'}
            />

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
                }
            >
                <Card>
                    <View>
                        <FastImage
                            style={{
                                width: mainImgWidth * 0.85,
                                height: mainImgHeight * 0.85
                            }}
                            source={{
                                uri: `${server.protocol}://${server.ip}:${server.port}${media.art}?X-Plex-Token=${server.token}`,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={ FastImage.resizeMode.contain }
                        />

                        <Text style={ [style.textColor, style.textLabel] }>{ media.title } { media.studio ? `- ${media.studio}` : '' }</Text>
                        <Card.Divider />

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Summary : </Text>
                            { media.summary }
                        </Text>

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Duration : </Text>
                            { media.duration ? new Date(media.duration).toISOString().slice(11, 19) : 'unknown' }
                        </Text>

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Rating : </Text>
                            { media.rating ? media.rating : 'unknown' }
                        </Text>

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Added at : </Text>
                            { getDateFromTimestamp(media.addedAt) } - { getTimeFromTimestamp(media.addedAt) }
                        </Text>
                    </View>
                </Card>

                {library.type === 'show' ? (
                    <Card>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={ [style.accordionTitle] }>Seasons</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={ seasonsList }
                            onPress={() => {
                                setSeasonsList(!seasonsList);
                            }}
                        >
                            {seasons.map((season, index) => {
                                return (
                                    <ListItem
                                        key={ index }
                                        bottomDivider
                                        onPress={async () => {
                                            try {
                                                setSpinner(true);

                                                let episodes = await axios.get(`${server.protocol}://${server.ip}:${server.port}${season.key}?X-Plex-Token=${server.token}`);

                                                navigation.navigate('SingleSeason', {
                                                    title: `${media.title} - ${season.title}`,
                                                    season: season,
                                                    episodes: episodes.data.MediaContainer.Metadata,
                                                    server: server,
                                                    media: media
                                                });

                                                setSpinner(false);
                                            } catch (e) {
                                                console.error(e);
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
                                                        uri: `${server.protocol}://${server.ip}:${server.port}${season.thumb}?X-Plex-Token=${server.token}`,
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
                                            <ListItem.Title>{ season.title }</ListItem.Title>
                                            <ListItem.Subtitle>{ season.year ? season.year : season.parentYear }</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron color='black' />
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

export default SingleMedia;
