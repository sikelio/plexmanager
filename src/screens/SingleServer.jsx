import React from 'react';
import axios from 'axios';
import { Button, ScrollView, View, Text, RefreshControl, Alert, Linking, StyleSheet } from 'react-native';
import { Card, ListItem, Avatar } from '@rneui/themed';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';
import { sendDeleteRequest, sendPostRequest, sendPutRequest, sendRequest } from "../functions/ServerRequest";
import { getDateFromTimestamp, getTimeFromTimestamp } from '../functions/GlobalUtiles';
import { getDeviceIcon, getLibraryIcon, getHistoryUser, historyTitle, sessionTitle } from '../functions/ServerManageUtiles';
import { useNavigation } from '@react-navigation/native';

class SingleServer extends React.Component {
    localStyle = StyleSheet.create({
        manageContainer: {
            flex: 1
        },
        serverIdLabel: {
            fontWeight: 'bold'
        },
        serverIdValue: {
            color: '#000000'
        },
        item: {
            color: '#000',
            width: '33%'
        },
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14
        },
        updateAllView: {
            width: '100%'
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            server: this.props.route.params.server,
            plexInfo: this.props.route.params.plexInfo,
            libraries: this.props.route.params.libraries,
            users: this.props.route.params.users,
            identity: this.props.route.params.identity,
            devices: this.props.route.params.devices,
            activeSessions: this.props.route.params.activeSessions,
            sessionHistory: this.props.route.params.sessionHistory,
            userList: false,
            devicesList: false,
            sessionsList: false,
            sessionHistoryList: false,
            refreshing: false,
            spinner: false,
            librariesList: false,
            identityList: false,
            maintenanceList: false,
            securityList: false,
            troubleshootingList: false,
            scheduledTaskList: false,
        };

        this.refresh = this.refresh.bind(this);
    }

    async updateServer() {
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
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/accounts/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/devices/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/status/sessions?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/status/sessions/history/all?X-Plex-Token=${this.state.server.token}`)
            ]);

            this.setState({ plexInfo: updatedPlexInfo.data[server.serverType][updatedIdentity.data.MediaContainer.platform] });
            this.setState({ libraries: updatedLibraries.data.MediaContainer.Directory });
            this.setState({ users: updatedUsers.data.MediaContainer.Account });
            this.setState({ identity: updatedIdentity.data.MediaContainer });
            this.setState({ devices: updatedDevices.data.MediaContainer.Device });
            this.setState({ activeSessions: updatedActiveSessions.data.MediaContainer.Metadata });
            this.setState({ sessionHistory: updatedSessionHistory.data.MediaContainer });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during the server fetch!');
        }
    }

    refresh() {
        this.setState({ refreshing: true });

        this.updateServer()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    checkPlexVersion(installedVersion, fetchVersion) {
        if (fetchVersion > installedVersion) {
            return `${installedVersion} - Update available`;
        }

        return `${installedVersion}`;
    }

    render() {
        return (
            <View style={this.localStyle.manageContainer}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />

                <ScrollView refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                }>
                    <Card>
                        <>
                            <ListItem.Accordion
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Identity</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.identityList}
                                onPress={() => {
                                    this.setState({ identityList: !this.state.identityList });
                                }}
                            >
                                <ListItem
                                    bottomDivider
                                >
                                    <ListItem.Content>
                                        <Text style={this.localStyle.serverIdValue}>
                                            <Text style={this.localStyle.serverIdLabel}>PMS Version: </Text>
                                            {this.checkPlexVersion(this.state.identity.version, this.state.plexInfo.version)}
                                        </Text>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <Text style={this.localStyle.serverIdValue}>
                                        <Text style={this.localStyle.serverIdLabel}>Machine ID: </Text>
                                        {this.state.identity.machineIdentifier}
                                    </Text>
                                </ListItem>

                                <ListItem>
                                    <Text style={this.localStyle.serverIdValue}>
                                        <Text style={this.localStyle.serverIdLabel}>Plex Pass: </Text>
                                        {this.state.identity.myPlexSubscription.toString()}
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
                                                        this.setState({ spinner: true });

                                                        let preferences = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/:/prefs?X-Plex-Token=${this.state.server.token}`);

                                                        this.props.navigation.navigate('ServerPreferences', {
                                                            preferences: preferences.data.MediaContainer.Setting
                                                        });

                                                        this.setState({ spinner: false });
                                                    } catch (e) {
                                                        Alert.alert('Error', 'Something went wrong while preferences fetch!');
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Libraries</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.librariesList}
                                onPress={() => {
                                    this.setState({ librariesList: !this.state.librariesList });
                                }}
                            >
                                <ListItem
                                    bottomDivider
                                >
                                    <ListItem.Content>
                                        <View style={this.localStyle.updateAllView}>
                                            <Button
                                                title='Update all'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/all/refresh?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                {this.state.libraries.map((library, index) => {
                                    return (
                                        <ListItem
                                            key={index}
                                            bottomDivider
                                            onPress={async () => {
                                                try {
                                                    this.setState({ spinner: true });

                                                    let items = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/${library.key}/all?X-Plex-Token=${this.state.server.token}`);

                                                    this.props.navigation.navigate('SingleLibrary', {
                                                        title: library.title,
                                                        library: library,
                                                        server: this.state.server,
                                                        medias: items.data.MediaContainer.Metadata
                                                    });

                                                    this.setState({ spinner: false });
                                                } catch (e) {
                                                    Alert.alert('Error', 'Something went wrong during librairies fetch!');
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
                                                            position: 'absolute',
                                                        }}
                                                        source={getLibraryIcon(library.type)}
                                                        resizeMode={FastImage.resizeMode.contain}
                                                    />
                                                )}
                                                overlayContainerStyle={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            />

                                            <ListItem.Content>
                                                <ListItem.Title>{library.title}</ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Chevron color='black' />
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Users</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.userList}
                                onPress={() => {
                                    this.setState({ userList: !this.state.userList });
                                }}
                            >
                                {this.state.users.map((user, index) => {
                                    if (user.name) {
                                        return (
                                            <ListItem
                                                key={index}
                                                bottomDivider
                                                onPress={async () => {
                                                    try {
                                                        this.setState({ spinner: true });

                                                        const userDetails = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/accounts/${user.id}?X-Plex-Token=${this.state.server.token}`);

                                                        this.props.navigation.navigate('SingleAccount', {
                                                            title: user.name,
                                                            user: user,
                                                            userDetails: userDetails.data.MediaContainer.Account[0]
                                                        });

                                                        this.setState({ spinner: false });
                                                    } catch (e) {
                                                        Alert.alert('Error', 'Something went wront during acoount fetch!');
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
                                                            source={require('../assets/icons/user.png')}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                    )}
                                                    overlayContainerStyle={{
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                />

                                                <ListItem.Content>
                                                    <ListItem.Title>{user.name}</ListItem.Title>
                                                </ListItem.Content>
                                                <ListItem.Chevron color='black' />
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Devices</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.devicesList}
                                onPress={() => {
                                    this.setState({ devicesList: !this.state.devicesList });
                                }}
                            >
                                {this.state.devices.map((device, index) => {
                                    if (device.name) {
                                        return (
                                            <ListItem
                                                key={index + 1}
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
                                                            source={getDeviceIcon(device.platform)}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                    )}
                                                    overlayContainerStyle={{
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                />

                                                <ListItem.Content>
                                                    <ListItem.Title>{device.name} - {device.platform}</ListItem.Title>
                                                    <ListItem.Subtitle>Client ID: {device.clientIdentifier}</ListItem.Subtitle>
                                                    <ListItem.Subtitle>Created at: {getDateFromTimestamp(device.createdAt)}</ListItem.Subtitle>
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Sessions</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={ this.state.sessionsList }
                                onPress={() => {
                                    this.setState({ sessionsList: !this.state.sessionsList });
                                }}
                            >
                                {!this.state.activeSessions ? (
                                    <ListItem>
                                        <ListItem.Content>
                                            <ListItem.Title>No sessions</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                ) : (
                                    this.state.activeSessions.length > 0 && this.state.activeSessions.map((session, index) => {
                                        return (
                                            <ListItem
                                                key={index + 1}
                                                bottomDivider
                                                onPress={() => {
                                                    this.props.navigation.navigate('SingleSession', {
                                                        title: session.Session.id,
                                                        server: this.state.server,
                                                        session: session
                                                    })
                                                }}
                                            >
                                                <Avatar
                                                    rounded
                                                    source={{uri: session.User.thumb}}
                                                />
                                                <ListItem.Content>
                                                    <ListItem.Title>{sessionTitle(session)}</ListItem.Title>
                                                    <ListItem.Subtitle>{session.Player.state}</ListItem.Subtitle>
                                                    <ListItem.Subtitle>{session.Player.address}</ListItem.Subtitle>
                                                    <ListItem.Subtitle>{session.Player.product}</ListItem.Subtitle>
                                                    <ListItem.Subtitle>{session.Player.version}</ListItem.Subtitle>
                                                </ListItem.Content>
                                                <ListItem.Chevron color='black' />
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Session History</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.sessionHistoryList}
                                onPress={() => {
                                    this.setState({ sessionHistoryList: !this.state.sessionHistoryList });
                                }}
                            >
                                {!this.state.sessionHistory.size > 0 ? (
                                    <ListItem>
                                        <ListItem.Content>
                                            <ListItem.Title>No session history</ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                ) : (
                                    this.state.sessionHistory.Metadata.map((session, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                            >
                                                <ListItem.Content>
                                                    <ListItem.Title>{historyTitle(session)}</ListItem.Title>
                                                    <ListItem.Subtitle>Viewed at: {getTimeFromTimestamp(session.viewedAt)} - {getDateFromTimestamp(session.viewedAt)}</ListItem.Subtitle>
                                                    <ListItem.Subtitle>By: {getHistoryUser(session, this.state.users)}</ListItem.Subtitle>
                                                </ListItem.Content>
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Maintenance</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.maintenanceList}
                                onPress={() => {
                                    this.setState({ maintenanceList: !this.state.maintenanceList });
                                }}
                            >
                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Clean bundle'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendPutRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/clean/bundles?async=1&X-Plex-Token=${this.state.server.token}`);
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
                                                    sendPutRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/optimize?async=1&X-Plex-Token=${this.state.server.token}`);
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Tasks</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.scheduledTaskList}
                                onPress={() => {
                                    this.setState({ scheduledTaskList: !this.state.scheduledTaskList });
                                }}
                            >
                                <ListItem
                                    bottomDivider
                                    onPress={async () => {
                                        try {
                                            this.setState({ spinner: true });

                                            let scheduledTasks = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler?X-Plex-Token=${this.state.server.token}`);

                                            this.props.navigation.navigate('ScheduledTasks', {
                                                scheduledTasks: scheduledTasks.data.ButlerTasks.ButlerTask
                                            });

                                            this.setState({ spinner: false });
                                        } catch (e) {
                                            Alert.alert('Error', 'Something went wront during scheduled tasks fetch!');
                                        }
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title>All scheduled tasks</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron color='black' />
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Start Backup Database Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendPostRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/BackupDatabase?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Stop Backup Database Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/BackupDatabase?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Run Optimize Database Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendPostRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/OptimizeDatabase?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Stop Optimize Database Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/OptimizeDatabase?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Run Clean Old Bundles Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendPostRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/CleanOldBundles?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Stop Clean Old Bundles Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/CleanOldBundles?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Run Clean Old Cache Files Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendPostRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/CleanOldCacheFiles?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Run Clean Old Cache Files Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/CleanOldCacheFiles?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                              title='Run Refresh Libraries Task'
                                              color='#e5a00d'
                                              onPress={() => {
                                                  sendPostRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/RefreshLibraries?X-Plex-Token=${this.state.server.token}`);
                                              }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                              title='Stop Refresh Libraries Task'
                                              color='#e5a00d'
                                              onPress={() => {
                                                  sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/RefreshLibraries?X-Plex-Token=${this.state.server.token}`);
                                              }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem>
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Stop All Scheduled Tasks'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/?X-Plex-Token=${this.state.server.token}`);
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Security</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.securityList}
                                onPress={() => {
                                    this.setState({ securityList: !this.state.securityList });
                                }}
                            >
                                <ListItem
                                    bottomDivider
                                >
                                    <ListItem.Content>
                                        <View style={this.localStyle.updateAllView}>
                                            <Button
                                                title='Get Transient Token'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    Alert.alert('Work In Progress', 'This functionality is being delayed because of Bad Request by following the documentation.');
                                                    // sendRequest(`${server.protocol}://${server.ip}:${server.port}/security/token?X-Plex-Token=${server.token}`);
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
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Troubleshooting</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.troubleshootingList}
                                onPress={() => {
                                    this.setState({ troubleshootingList: !this.state.troubleshootingList });
                                }}
                            >
                                <ListItem
                                    bottomDivider
                                >
                                    <ListItem.Content>
                                        <View style={this.localStyle.updateAllView}>
                                            <Button
                                                title='Download the databases'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    Linking.openURL(`${server.protocol}://${server.ip}:${server.port}/diagnostics/databases/?X-Plex-Token=${server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>

                                    <ListItem.Content>
                                        <View style={this.localStyle.updateAllView}>
                                            <Button
                                                title='Download the logs'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    Linking.openURL(`${server.protocol}://${server.ip}:${server.port}/diagnostics/logs/?X-Plex-Token=${server.token}`);
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
}

export default (props) => {
    const navigation = useNavigation();
    return <SingleServer {...props} navigation={navigation} />;
};
