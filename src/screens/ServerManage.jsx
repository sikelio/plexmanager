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
    const [ identity, setIdentity ] = useState(route.params.identity);
    const [ devices, setDevices ] = useState(route.params.devices);
    const [ userList, setUserList ] = useState(false);
    const [ devicesList, setDevicesList ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);

    const updateData = async () => {
        try {
            const updatedLibraries = await axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`);
            const updatedUsers = await axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`);
            const updatedIdentity = await axios.get(`${server.protocol}://${server.ip}:${server.port}/identity/?X-Plex-Token=${server.token}`);
            const updatedDevices = await axios.get(`${server.protocol}://${server.ip}:${server.port}/devices/?X-Plex-Token=${server.token}`);

            setLibraries(updatedLibraries.data.MediaContainer.Directory);
            setUsers(updatedUsers.data.MediaContainer.Account);
            setIdentity(updatedIdentity.data.MediaContainer);
            setDevices(updatedDevices.data.MediaContainer.Device)
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

    const timestampParser = (timestamp) => {
        const date = new Date(timestamp * 1000);

        return `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
        }>
            <Card>
                <Card.Title>Server identity</Card.Title>
                <Card.Divider />
                <View style={ [style.container] }>
                    <Text style={ [style.itemHalf] }>Plex Media Server Version</Text>
                    <Text style={ [style.itemHalf] }>: { identity.version }</Text>

                    <Text style={ [style.itemHalf] }>Machine identifier</Text>
                    <Text style={ [style.itemHalf] }>: { identity.machineIdentifier }</Text>

                    <Text style={ [style.itemHalf] }>Claimed</Text>
                    <Text style={ [style.itemHalf] }>: { identity.claimed.toString() }</Text>
                </View>
            </Card>

            <Card>
                <Card.Title>Scan all libraries</Card.Title>
                <Card.Divider />
                <View>
                    <Button
                        title='Update all'
                        color='#e5a00d'
                        onPress={() => {
                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/all/refresh?X-Plex-Token=${server.token}`);
                        }}
                    />
                </View>
            </Card>

            <Card>
                <Card.Title>Scan single library & Refresh metadata</Card.Title>
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

                                <View style={ [style.actionBtn] }>
                                    <Button
                                        title="Update"
                                        color='#e5a00d'
                                        onPress={() => {
                                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${lib.key}/refresh?X-Plex-Token=${server.token}`);
                                        }}
                                    />
                                </View>

                                <View style={ [style.actionBtn] }>
                                    <Button
                                        title="Metadata"
                                        color='#e5a00d'
                                        onPress={() => {
                                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${lib.key}/refresh?force=1&X-Plex-Token=${server.token}`);
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

            <Card>
                <>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={ [style.accordionTitle] }>Devices</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={ devicesList }
                        onPress={() => {
                            setDevicesList(!devicesList);
                        }}
                    >
                        {devices.map((device, index) => {
                            if (device.name) {
                                return (
                                    <ListItem key={ index + 1 }>
                                        <ListItem.Content>
                                            <ListItem.Title>{ device.name } - { device.platform }</ListItem.Title>
                                            <ListItem.Subtitle>Client ID : { device.clientIdentifier } </ListItem.Subtitle>
                                            <ListItem.Subtitle>Created at : { timestampParser(device.createdAt) } </ListItem.Subtitle>
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
