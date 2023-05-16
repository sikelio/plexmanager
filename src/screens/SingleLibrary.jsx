// Dependencies
import React, { useCallback, useState } from "react";
import axios from "axios";
// Components
import { RefreshControl, ScrollView, View } from "react-native";
import { Card, Button, ListItem, Avatar } from "@rneui/themed";
import FastImage from "react-native-fast-image";
import Spinner from "react-native-loading-spinner-overlay";
// Functions
import { sendPutRequest, sendRequest } from "../functions/ServerRequest";
// Styles
import style from "../style/LibraryManageStyle"

const SingleLibrary = ({ route, navigation }) => {
    const { library, server } = route.params;

    const [ mediaList, setMediaList ] = useState(false);
    const [ spinner, setSpinner ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ medias, setMedias ] = useState(route.params.medias);

    const updateLibrary = async () => {
        try {
            const [
                updatedMedias
            ] = await Promise.all([
                axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/all?X-Plex-Token=${server.token}`)
            ]);

            setMedias(updatedMedias.data.MediaContainer.Metadata);
        } catch (e) {}
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        updateLibrary().finally(() => {
            setRefreshing(false);
        });
    }, []);

    return (
        <View style={ [style.libraryContainer] }>
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
                    <Card.Title>Actions</Card.Title>
                    <Card.Divider />
                    <View style={ [style.container, style.upperContainer] }>
                        <Button
                            title='Scan'
                            containerStyle={{
                                width: '48%'
                            }}
                            buttonStyle={{
                                backgroundColor: '#e5a00d'
                            }}
                            onPress={() => {
                                sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/refresh?X-Plex-Token=${server.token}`);
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
                                sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/refresh?force=1&X-Plex-Token=${server.token}`);
                            }}
                        />
                    </View>

                    <View style={ [style.container] }>
                        <Button
                            title='Empty Trash'
                            containerStyle={{
                                width: '100%'
                            }}
                            buttonStyle={{
                                backgroundColor: '#e5a00d'
                            }}
                            onPress={() => {
                                sendPutRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/emptyTrash?X-Plex-Token=${server.token}`);
                            }}
                        />
                    </View>
                </Card>

                <Card>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={ [style.accordionTitle] }>Medias</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={ mediaList }
                        onPress={() => {
                            setMediaList(!mediaList);
                        }}
                    >
                        {medias.map((media, index) => {
                            return (
                                <ListItem
                                    key={ index }
                                    bottomDivider
                                    onPress={async () => {
                                        setSpinner(true);

                                        if (library.type !== 'show') {
                                            return navigation.navigate('SingleMedia', {
                                                title: media.title,
                                                library: library,
                                                media: media,
                                                server: server
                                            });
                                        }

                                        try {
                                            let seasons = await axios.get(`${server.protocol}://${server.ip}:${server.port}${media.key}?X-Plex-Token=${server.token}`);

                                            navigation.navigate('SingleMedia', {
                                                title: media.title,
                                                library: library,
                                                media: media,
                                                server: server,
                                                seasons: seasons.data.MediaContainer.Metadata
                                            });

                                            setSpinner(false);
                                        } catch (e) {
                                            console.error(e)
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
                                                    uri: `${server.protocol}://${server.ip}:${server.port}${media.thumb}?X-Plex-Token=${server.token}`,
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
                                        <ListItem.Title>{ media.title }</ListItem.Title>
                                        <ListItem.Subtitle>{ media.studio }</ListItem.Subtitle>
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

export default SingleLibrary
