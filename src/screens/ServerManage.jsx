// Dependencies
import React, { useState } from "react";
import axios from "axios";
// Components
import { Button, ScrollView, View, Text, RefreshControl } from "react-native";
import { Card, ListItem, Avatar } from '@rneui/themed';
// Functions
import { sendRequest } from "../functions/ServerRequest";
import { timestampParser } from "../functions/GlobalUtiles";
import {getDeviceIcon, sessionTitle} from "../functions/ServerManageUtiles";
// Styles
import style from "../style/ServerManageStyle"

const ServerManage = ({ route, navigation }) => {
    const server = route.params.server;

    // Route params
    const [ plexInfo, setPlexInfo ] = useState(route.params.plexInfo);
    const [ libraries, setLibraries ] = useState(route.params.libraries);
    const [ users, setUsers ] = useState(route.params.users);
    const [ identity, setIdentity ] = useState(route.params.identity);
    const [ devices, setDevices ] = useState(route.params.devices);
    const [ activeSessions, setActiveSessions ] = useState(route.params.activeSessions);

    // Boolean components
    const [ userList, setUserList ] = useState(false);
    const [ devicesList, setDevicesList ] = useState(false);
    const [ sessionsList, setSessionsList ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);

    const updateData = async () => {
        try {
            const [
                updatedPlexInfo,
                updatedLibraries,
                updatedUsers,
                updatedIdentity,
                updatedDevices,
                updatedActiveSessions
            ] = await Promise.all([
                axios.get('https://plex.tv/api/downloads/5.json'),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/devices/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/status/sessions?X-Plex-Token=${server.token}`)
            ]);

            setPlexInfo(updatedPlexInfo.data[server.serverType][updatedIdentity.data.MediaContainer.platform]);
            setLibraries(updatedLibraries.data.MediaContainer.Directory);
            setUsers(updatedUsers.data.MediaContainer.Account);
            setIdentity(updatedIdentity.data.MediaContainer);
            setDevices(updatedDevices.data.MediaContainer.Device);
            setActiveSessions(updatedActiveSessions.data.MediaContainer.Metadata);
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

    const checkPlexVersion = (installedVersion, fetchVersion) => {
        if (fetchVersion > installedVersion) {
            return `${installedVersion} - Update available`;
        }

        return `${installedVersion}`;
    }

    return (
        <ScrollView refreshControl={
            <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
        }>
            <Card>
                <Card.Title>Server identity</Card.Title>
                <Card.Divider />
                <View style={ [style.container] }>
                    <Text style={ [style.serverIdLabel] }>PMS Version</Text>
                    <Text style={ [style.serverIdValue] }>: { checkPlexVersion(identity.version, plexInfo.version) }</Text>

                    <Text style={ [style.serverIdLabel] }>Machine ID</Text>
                    <Text style={ [style.serverIdValue] }>: { identity.machineIdentifier }</Text>

                    <Text style={ [style.serverIdLabel] }>Plex Pass</Text>
                    <Text style={ [style.serverIdValue] }>: { identity.myPlexSubscription.toString() }</Text>
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
                                    <ListItem
                                        key={ index }
                                        bottomDivider
                                    >
                                        <Avatar
                                            rounded
                                            icon={{
                                                name: 'user',
                                                type: 'font-awesome',
                                                size: 26,
                                            }}
                                            containerStyle={{ backgroundColor: '#c2c2c2' }}
                                        />
                                        <ListItem.Content>
                                            <ListItem.Title>{ user.name }</ListItem.Title>
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
                                    <ListItem
                                        key={ index + 1 }
                                    >
                                        <Avatar
                                            rounded
                                            icon={{
                                                name: getDeviceIcon(device.platform),
                                                type: 'font-awesome',
                                                size: 20,
                                            }}
                                            containerStyle={{ backgroundColor: '#c2c2c2' }}
                                        />
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

            <Card>
                <>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={ [style.accordionTitle] }>Sessions</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={ sessionsList }
                        onPress={() => {
                            setSessionsList(!sessionsList);
                        }}
                    >
                        {!activeSessions ? (
                            <ListItem>
                                <ListItem.Content>
                                    <ListItem.Title>No sessions</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ) : (
                            activeSessions.length > 0 && activeSessions.map((session, index) => {
                                return (
                                    <ListItem
                                        key={ index + 1 }
                                        bottomDivider
                                        onPress={() => {
                                            navigation.navigate('SessionManage', {
                                                title: session.Session.id,
                                                server: server,
                                                session: session
                                            })
                                        }}
                                    >
                                        <Avatar
                                            rounded
                                            source={{ uri: session.User.thumb }}
                                        />
                                        <ListItem.Content>
                                            <ListItem.Title>{ sessionTitle(session) }</ListItem.Title>
                                            <ListItem.Subtitle>{ session.Player.state }</ListItem.Subtitle>
                                            <ListItem.Subtitle>{ session.Player.address }</ListItem.Subtitle>
                                            <ListItem.Subtitle>{ session.Player.product }</ListItem.Subtitle>
                                            <ListItem.Subtitle>{ session.Player.version }</ListItem.Subtitle>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                );
                            })
                        )}
                    </ListItem.Accordion>
                </>
            </Card>
        </ScrollView>
    );
}

export default ServerManage;
