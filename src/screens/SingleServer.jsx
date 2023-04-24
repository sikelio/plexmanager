// Dependencies
import React, { useState } from "react";
import axios from "axios";
// Components
import { Button, ScrollView, View, Text, RefreshControl } from "react-native";
import { Card, ListItem, Avatar } from '@rneui/themed';
import Spinner from "react-native-loading-spinner-overlay";
import FastImage from "react-native-fast-image";
// Functions
import { sendPutRequest, sendRequest } from "../functions/ServerRequest";
import { getDateFromTimestamp, getTimeFromTimestamp } from "../functions/GlobalUtiles";
import { getDeviceIcon, getLibraryIcon, getHistoryUser, historyTitle, sessionTitle } from "../functions/ServerManageUtiles";
// Styles
import style from "../style/ServerManageStyle"

const SingleServer = ({ route, navigation }) => {
    const { server } = route.params;

    // Route params
    const [ plexInfo, setPlexInfo ] = useState(route.params.plexInfo);
    const [ libraries, setLibraries ] = useState(route.params.libraries);
    const [ users, setUsers ] = useState(route.params.users);
    const [ identity, setIdentity ] = useState(route.params.identity);
    const [ devices, setDevices ] = useState(route.params.devices);
    const [ activeSessions, setActiveSessions ] = useState(route.params.activeSessions);
    const [ sessionHistory, setSessionHistory ] = useState(route.params.sessionHistory);

    // Boolean components
    const [ userList, setUserList ] = useState(false);
    const [ devicesList, setDevicesList ] = useState(false);
    const [ sessionsList, setSessionsList ] = useState(false);
    const [ sessionHistoryList, setSessionHistoryList ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ spinner, setSpinner ] = useState(false);
    const [ librariesList, setLibrariesList ] = useState(false);
    const [ identityList, setIdentityList ] = useState(false);
    const [ maintenanceList, setMaintenanceList ] = useState(false);

    const updateData = async () => {
        try {
            const [
                updatedPlexInfo,
                updatedLibraries,
                updatedUsers,
                updatedIdentity,
                updatedDevices,
                updatedActiveSessions,
                updatedSessionHistory
            ] = await Promise.all([
                axios.get('https://plex.tv/api/downloads/5.json'),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/devices/?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/status/sessions?X-Plex-Token=${server.token}`),
                axios.get(`${server.protocol}://${server.ip}:${server.port}/status/sessions/history/all?X-Plex-Token=${server.token}`)
            ]);

            setPlexInfo(updatedPlexInfo.data[server.serverType][updatedIdentity.data.MediaContainer.platform]);
            setLibraries(updatedLibraries.data.MediaContainer.Directory);
            setUsers(updatedUsers.data.MediaContainer.Account);
            setIdentity(updatedIdentity.data.MediaContainer);
            setDevices(updatedDevices.data.MediaContainer.Device);
            setActiveSessions(updatedActiveSessions.data.MediaContainer.Metadata);
            setSessionHistory(updatedSessionHistory.data.MediaContainer.Metadata)
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
        <View style={ [style.manageContainer] }>
            <Spinner
                visible={ spinner }
                textContent={'Loading...'}
            />

            <ScrollView refreshControl={
                <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
            }>
                <Card>
                    <>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={ [style.accordionTitle] }>Identity</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={ identityList }
                            onPress={() => {
                                setIdentityList(!identityList)
                            }}
                        >
                            <ListItem
                                bottomDivider
                            >
                                <ListItem.Content>
                                    <Text
                                        style={ [style.serverIdValue] }
                                    >
                                        <Text
                                            style={ [style.serverIdLabel] }
                                        >
                                            PMS Version :
                                        </Text>
                                        <Text> { checkPlexVersion(identity.version, plexInfo.version) }</Text>
                                    </Text>
                                </ListItem.Content>
                            </ListItem>

                            <ListItem>
                                <Text
                                    style={ [style.serverIdValue] }
                                >
                                    <Text
                                        style={ [style.serverIdLabel] }
                                    >
                                        Machine ID :
                                    </Text>
                                    <Text> { identity.machineIdentifier }</Text>
                                </Text>
                            </ListItem>

                            <ListItem>
                                <Text
                                    style={ [style.serverIdValue] }
                                >
                                    <Text
                                        style={ [style.serverIdLabel] }
                                    >
                                        Plex Pass :
                                    </Text>
                                    <Text> { identity.myPlexSubscription.toString() }</Text>

                                </Text>
                            </ListItem>

                            <ListItem>
                                <ListItem.Content>
                                    <View style={{ width: '100%' }}>
                                        <Button
                                            title='Preferences'
                                            color='#e5a00d'
                                            onPress={async () => {
                                                try {
                                                    setSpinner(true);

                                                    let preferences = await axios.get(`${server.protocol}://${server.ip}:${server.port}/:/prefs?X-Plex-Token=${server.token}`);

                                                    navigation.navigate('ServerPreferences', {
                                                        preferences: preferences.data.MediaContainer.Setting
                                                    });

                                                    setSpinner(false);
                                                } catch (e) {
                                                    console.error(e)
                                                }
                                            }}
                                        />
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        </ListItem.Accordion>
                    </>
                </Card>

                <Card>
                    <>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={ [style.accordionTitle] }>Libraries</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={ librariesList }
                            onPress={() => {
                                setLibrariesList(!librariesList);
                            }}
                        >
                            <ListItem
                                bottomDivider
                            >
                                <ListItem.Content>
                                    <View style={ [style.updateAllView] }>
                                        <Button
                                            title='Update all'
                                            color='#e5a00d'
                                            onPress={() => {
                                                sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/all/refresh?X-Plex-Token=${server.token}`);
                                            }}
                                        />
                                    </View>
                                </ListItem.Content>
                            </ListItem>

                            {libraries.map((library, index) => {
                                return (
                                    <ListItem
                                        key={ index }
                                        bottomDivider
                                        onPress={async () => {
                                            try {
                                                setSpinner(true);

                                                let items = await axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/all?X-Plex-Token=${server.token}`);

                                                navigation.navigate('SingleLibrary', {
                                                    title: library.title,
                                                    library: library,
                                                    server: server,
                                                    medias: items.data.MediaContainer.Metadata
                                                });

                                                setSpinner(false);
                                            } catch (e) {}
                                        }}
                                    >
                                        <Avatar
                                            containerStyle={{ backgroundColor: '#E3E3E3' }}
                                            rounded
                                            ImageComponent={() => (
                                                <FastImage
                                                    style={{
                                                        width: 22.5,
                                                        height: 22.5,
                                                        position: 'absolute',
                                                    }}
                                                    source={ getLibraryIcon(library.type) }
                                                    resizeMode={ FastImage.resizeMode.contain }
                                                />
                                            )}
                                            overlayContainerStyle={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        />

                                        <ListItem.Content>
                                            <ListItem.Title>{ library.title }</ListItem.Title>
                                        </ListItem.Content>
                                        <ListItem.Chevron />
                                    </ListItem>
                                );
                            })}
                        </ListItem.Accordion>
                    </>
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
                                            onPress={async () => {
                                                try {
                                                    setSpinner(true);
                                                    const userDetails = await axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/${user.id}?X-Plex-Token=${server.token}`);

                                                    navigation.navigate('SingleAccount', {
                                                        title: user.name,
                                                        user: user,
                                                        userDetails: userDetails.data.MediaContainer.Account[0]
                                                    });

                                                    setSpinner(false);
                                                } catch (e) {
                                                    console.error(e)
                                                }
                                            }}
                                        >
                                            <Avatar
                                                containerStyle={{ backgroundColor: '#E3E3E3' }}
                                                rounded
                                                ImageComponent={() => (
                                                    <FastImage
                                                        style={{
                                                            width: 22.5,
                                                            height: 22.5,
                                                            borderRadius: 25,
                                                            position: 'absolute',
                                                        }}
                                                        source={ require('../assets/icons/user.png') }
                                                        resizeMode={ FastImage.resizeMode.contain }
                                                    />
                                                )}
                                                overlayContainerStyle={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            />

                                            <ListItem.Content>
                                                <ListItem.Title>{ user.name }</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Chevron />
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
                                                containerStyle={{ backgroundColor: '#E3E3E3' }}
                                                rounded
                                                ImageComponent={() => (
                                                    <FastImage
                                                        style={{
                                                            width: 22.5,
                                                            height: 22.5,
                                                            borderRadius: 25,
                                                            position: 'absolute',
                                                        }}
                                                        source={ getDeviceIcon(device.platform) }
                                                        resizeMode={ FastImage.resizeMode.contain }
                                                    />
                                                )}
                                                overlayContainerStyle={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            />

                                            <ListItem.Content>
                                                <ListItem.Title>{ device.name } - { device.platform }</ListItem.Title>
                                                <ListItem.Subtitle>Client ID : { device.clientIdentifier } </ListItem.Subtitle>
                                                <ListItem.Subtitle>Created at : { getDateFromTimestamp(device.createdAt) } </ListItem.Subtitle>
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
                                                navigation.navigate('SingleSession', {
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

                <Card>
                    <>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={ [style.accordionTitle] }>Session History</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={ sessionHistoryList }
                            onPress={() => {
                                setSessionHistoryList(!sessionHistoryList);
                            }}
                        >
                            {sessionHistory.map((session, index) => {
                                return (
                                    <ListItem
                                        key={ index }
                                    >
                                        <ListItem.Content>
                                            <ListItem.Title>{ historyTitle(session) }</ListItem.Title>
                                            <ListItem.Subtitle>Viewed at : { getTimeFromTimestamp(session.viewedAt) } - { getDateFromTimestamp(session.viewedAt) }</ListItem.Subtitle>
                                            <ListItem.Subtitle>By : { getHistoryUser(session, users) }</ListItem.Subtitle>
                                        </ListItem.Content>
                                    </ListItem>
                                );
                            })}
                        </ListItem.Accordion>
                    </>
                </Card>

                <Card>
                    <>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={ [style.accordionTitle] }>Maintenance</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={ maintenanceList }
                            onPress={() => {
                                setMaintenanceList(!maintenanceList);
                            }}
                        >
                            <ListItem>
                                <ListItem.Content>
                                    <View style={{ width: '100%' }}>
                                        <Button
                                            title='Clean bundle'
                                            color='#e5a00d'
                                            onPress={() => {
                                                sendPutRequest(`${server.protocol}://${server.ip}:${server.port}/library/clean/bundles?async=1&X-Plex-Token=${server.token}`);
                                            }}
                                        />
                                    </View>
                                </ListItem.Content>
                            </ListItem>

                            <ListItem>
                                <ListItem.Content>
                                    <View style={{ width: '100%' }}>
                                        <Button
                                            title='Optimize database'
                                            color='#e5a00d'
                                            onPress={() => {
                                                sendPutRequest(`${server.protocol}://${server.ip}:${server.port}/library/optimize?async=1&X-Plex-Token=${server.token}`);
                                            }}
                                        />
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        </ListItem.Accordion>
                    </>
                </Card>
            </ScrollView>
        </View>
    );
}

export default SingleServer;
