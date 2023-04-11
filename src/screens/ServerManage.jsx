// Dependencies
import React, { useState } from "react";
import axios from "axios";
// Components
import { Button, ScrollView, View, Text, RefreshControl } from "react-native";
import { Card, ListItem } from '@rneui/themed';
// Functions
import { sendRequest } from "../functions/ServerRequest";
// Styles
import style from "../style/ServerManageStyle"

const ServerManage = ({ route }) => {
    const server = route.params.server;

    const [ libraries, setLibraries ] = useState(route.params.libraries);
    const [ users, setUsers ] = useState(route.params.users);
    const [ userList, setUserList ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);

    const updateData = async () => {
        try {
            const updatedLibraries = await axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`);
            const updatedUsers = await axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`);

            setLibraries(updatedLibraries.data.MediaContainer.Directory);
            setUsers(updatedUsers.data.MediaContainer.Account);
        } catch (error) {
            console.log(error);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        updateData().finally(() => {
            setRefreshing(false);
        });
    }, []);

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
        }>
            <Card key='Update all card'>
                <Card.Title>Scan all libraries</Card.Title>
                <Card.Divider />
                <View key='Update all'>
                    <Button
                        title='Update all'
                        color='#e5a00d'
                        onPress={() => {
                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/all/refresh?X-Plex-Token=${server.token}`);
                        }}
                    />
                </View>
            </Card>

            <Card key='Update single card'>
                <Card.Title>Scan single library</Card.Title>
                <Card.Divider />
                <View>
                    {libraries.map((lib, index) => {
                        return (
                            <View
                                key={ index }
                                style={ [style.container] }
                            >
                                <Text
                                    style={ [style.item] }
                                >
                                    { lib.title }
                                </Text>

                                <View style={ [style.item] }>
                                    <Button
                                        title="Update"
                                        color='#e5a00d'
                                        onPress={() => {
                                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${lib.key}/refresh?X-Plex-Token=${server.token}`);
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Card>

            <Card>
                <>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={ [style.accordionTitle] }>Users</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={userList}
                        onPress={() => {
                            setUserList(!userList);
                        }}
                    >
                        {users.map((user, index) => {
                            if (user.name) {
                                return (
                                    <ListItem key={ index }>
                                        <ListItem.Content>
                                            <ListItem.Title> - { user.name }</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                );
                            }
                        })}
                    </ListItem.Accordion>
                </>
            </Card>
        </ScrollView>
    );
}

export default ServerManage;
