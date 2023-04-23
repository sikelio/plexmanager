// Dependencies
import React, { useState } from "react";
// Components
import { ScrollView, View } from "react-native";
import { Card, Button, ListItem, Avatar } from "@rneui/themed";
import FastImage from "react-native-fast-image";
// Functions
import { sendRequest } from "../functions/ServerRequest";
// Styles
import style from "../style/LibraryManageStyle"

const LibraryManage = ({ route, navigation }) => {
    const { medias, library, server } = route.params;

    const [ mediaList, setMediaList ] = useState(false);

    return (
        <ScrollView>
            <Card>
                <Card.Title>Actions</Card.Title>
                <Card.Divider />
                <View style={ [style.container] }>
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
                                onPress={() => {
                                    navigation.navigate('SingleMedia', {
                                        title: media.title,
                                        library: library,
                                        media: media,
                                        server: server
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
                                <ListItem.Chevron />
                            </ListItem>
                        );
                    })}
                </ListItem.Accordion>
            </Card>
        </ScrollView>
    );
}

export default LibraryManage
