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
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from '../utiles/Colors';

class SingleServer extends React.Component {
    localStyle = StyleSheet.create({
        manageContainer: {
            flex: 1
        },
        serverIdLabel: {
            fontWeight: 'bold'
        },
        serverIdValue: {
            color: Colors.White
        },
        item: {
            width: '33%'
        },
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14,
            color: Colors.PlexYellow
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
            sessionHistory: this.props.route.params.sessionHistory,
            userList: false,
            devicesList: false,
            sessionsList: false,
            sessionHistoryList: false,
            activitiesList: false,
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
                updatedSessionHistory
            ] = await Promise.all([
                axios.get('https://plex.tv/api/downloads/5.json'),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/library/sections/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/accounts/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/devices/?X-Plex-Token=${this.state.server.token}`),
                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/status/sessions/history/all?X-Plex-Token=${this.state.server.token}`)
            ]);

            this.setState({ plexInfo: updatedPlexInfo.data[this.state.server.serverType][updatedIdentity.data.MediaContainer.platform] });
            this.setState({ libraries: updatedLibraries.data.MediaContainer.Directory });
            this.setState({ users: updatedUsers.data.MediaContainer.Account });
            this.setState({ identity: updatedIdentity.data.MediaContainer });
            this.setState({ devices: updatedDevices.data.MediaContainer.Device });
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
                        backgroundColor: Colors.PlexGrey,
                        borderColor: Colors.White
                    }}
                >
                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <Text style={this.localStyle.serverIdValue}>
                                            <Text style={this.localStyle.serverIdLabel}>PMS Version: </Text>
                                            {this.checkPlexVersion(this.state.identity.version, this.state.plexInfo.version)}
                                        </Text>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <Text style={this.localStyle.serverIdValue}>
                                        <Text style={this.localStyle.serverIdLabel}>Machine ID: </Text>
                                        {this.state.identity.machineIdentifier}
                                    </Text>
                                </ListItem>

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <Text style={this.localStyle.serverIdValue}>
                                        <Text style={this.localStyle.serverIdLabel}>Plex Pass: </Text>
                                        {this.state.identity.myPlexSubscription.toString()}
                                    </Text>
                                </ListItem>

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Server Preferences'
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

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Server Capabilities'
                                                color='#e5a00d'
                                                onPress={async () => {
                                                    try {
                                                        this.setState({ spinner: true });

                                                        let serverCapabilities = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/?X-Plex-Token=${this.state.server.token}`);

                                                        this.props.navigation.navigate('ServerCapabilities', {
                                                            serverCapabilities: serverCapabilities.data.MediaContainer,
                                                            server: this.state.server
                                                        });

                                                        this.setState({ spinner: false });
                                                    } catch (e) {
                                                        this.setState({ spinner: false });

                                                        Alert.alert('Error', 'Something went wrong while server capabilities fetch!');
                                                    }
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
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
                                            containerStyle={{
                                                backgroundColor: Colors.PlexBlack
                                            }}
                                        >
                                            <Avatar
                                                containerStyle={{ backgroundColor: Colors.PlexGrey }}
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
                                                <ListItem.Title
                                                    style={{
                                                        color: Colors.White
                                                    }}
                                                >
                                                    {library.title}
                                                </ListItem.Title>
                                            </ListItem.Content>
                                            <ListItem.Chevron color={Colors.White} />
                                        </ListItem>
                                    );
                                })}
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                {this.state.users.map((user, index) => {
                                    if (user.name) {
                                        return (
                                            <ListItem
                                                key={index}
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
                                                containerStyle={{
                                                    backgroundColor: Colors.PlexBlack
                                                }}
                                            >
                                                <Avatar
                                                    containerStyle={{ backgroundColor: Colors.PlexGrey }}
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
                                                    <ListItem.Title
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        {user.name}
                                                    </ListItem.Title>
                                                </ListItem.Content>
                                                <ListItem.Chevron color={Colors.White} />
                                            </ListItem>
                                        );
                                    }
                                })}
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                {this.state.devices.map((device, index) => {
                                    if (device.name) {
                                        return (
                                            <ListItem
                                                key={index + 1}
                                                containerStyle={{
                                                    backgroundColor: Colors.PlexBlack
                                                }}
                                            >
                                                <Avatar
                                                    containerStyle={{ backgroundColor: Colors.PlexGrey }}
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
                                                    <ListItem.Title
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        {device.name} - {device.platform}
                                                    </ListItem.Title>

                                                    <ListItem.Subtitle
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        Client ID: {device.clientIdentifier}
                                                    </ListItem.Subtitle>

                                                    <ListItem.Subtitle
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        Created at: {getDateFromTimestamp(device.createdAt)}
                                                    </ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        );
                                    }
                                })}
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    onPress={async () => {
                                        try {
                                            this.setState({ spinner: true });

                                            const activeSessions = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/status/sessions?X-Plex-Token=${this.state.server.token}`);

                                            this.props.navigation.navigate('ActiveSessions', {
                                                sessions: activeSessions.data.MediaContainer.Metadata,
                                                server: this.state.server
                                            });

                                            this.setState({ spinner: false });
                                        } catch (e) {
                                            Alert.alert('Error', 'Something went wrong during active sessions fetch!');
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            Active Sessions
                                        </ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron color={Colors.White} />
                                </ListItem>

                                <ListItem
                                    onPress={async () => {
                                        try {
                                            this.setState({ spinner: true });

                                            let [
                                                activeSessions,
                                                transcodingSessions
                                            ] = await Promise.all([
                                                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/status/sessions?X-Plex-Token=${this.state.server.token}`),
                                                axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/transcode/sessions?X-Plex-Token=${this.state.server.token}`)
                                            ]);

                                            let filteredTrancodeSession = [];

                                            transcodingSessions.data.MediaContainer.TranscodeSession.forEach(transcodingSession => {
                                                if (transcodingSession.videoDecision === 'transcode') {
                                                    const filteredSessions = activeSessions.data.MediaContainer.Metadata.filter((activeSession) => {
                                                        return activeSession.TranscodeSession.key === `/transcode/sessions/${transcodingSession.key}`;
                                                    });
    
                                                    filteredTrancodeSession.push(filteredSessions[0]);
                                                }
                                            });

                                            this.props.navigation.navigate('TranscodingSessions', {
                                                sessions: filteredTrancodeSession,
                                                server: this.state.server
                                            });

                                            this.setState({ spinner: false });
                                        } catch (e) {
                                            this.setState({ spinner: false });

                                            Alert.alert('Error', 'Something went wrong during transcoding sessions fetch!');
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            Transcoding Sessions
                                        </ListItem.Title>
                                    </ListItem.Content>

                                    <ListItem.Chevron color={Colors.White} />
                                </ListItem>
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                {!this.state.sessionHistory.size > 0 ? (
                                    <ListItem>
                                        <ListItem.Content
                                            containerStyle={{
                                                backgroundColor: Colors.PlexBlack
                                            }}
                                        >
                                            <ListItem.Title
                                                style={{
                                                    color: Colors.White
                                                }}
                                            >
                                                No session history
                                            </ListItem.Title>
                                        </ListItem.Content>
                                    </ListItem>
                                ) : (
                                    this.state.sessionHistory.Metadata.map((session, index) => {
                                        return (
                                            <ListItem
                                                key={index}
                                                containerStyle={{
                                                    backgroundColor: Colors.PlexBlack
                                                }}
                                            >
                                                <ListItem.Content>
                                                    <ListItem.Title
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        {historyTitle(session)}
                                                    </ListItem.Title>

                                                    <ListItem.Subtitle
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        Viewed at: {getTimeFromTimestamp(session.viewedAt)} - {getDateFromTimestamp(session.viewedAt)}
                                                    </ListItem.Subtitle>

                                                    <ListItem.Subtitle
                                                        style={{
                                                            color: Colors.White
                                                        }}
                                                    >
                                                        By: {getHistoryUser(session, this.state.users)}
                                                    </ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        );
                                    })
                                )}
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
                        <>
                            <ListItem.Accordion
                                content={
                                    <ListItem.Content>
                                        <ListItem.Title style={this.localStyle.accordionTitle}>Activities</ListItem.Title>
                                    </ListItem.Content>
                                }
                                isExpanded={this.state.activitiesList}
                                onPress={() => {
                                    this.setState({ activitiesList: !this.state.activitiesList });
                                }}
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    onPress={async () => {
                                        try {
                                            const activities = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/activities?X-Plex-Token=${this.state.server.token}`);

                                            this.props.navigation.navigate('Activities', {
                                                server: this.state.server,
                                                activities: activities.data.MediaContainer
                                            });
                                        } catch (e) {
                                            Alert.alert('Error', 'Somenthing went wront during activities fetch!');
                                        }
                                    }}
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            All activities
                                        </ListItem.Title>
                                    </ListItem.Content>

                                    <ListItem.Chevron color={Colors.White} />
                                </ListItem>
                            </ListItem.Accordion>
                        </>
                    </Card>

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
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
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            All scheduled tasks
                                        </ListItem.Title>
                                    </ListItem.Content>

                                    <ListItem.Chevron color={Colors.White} />
                                </ListItem>

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                                    <ListItem.Content>
                                        <View style={{ width: '100%' }}>
                                            <Button
                                                title='Stop Clean Old Cache Files Task'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    sendDeleteRequest(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/butler/CleanOldCacheFiles?X-Plex-Token=${this.state.server.token}`);
                                                }}
                                            />
                                        </View>
                                    </ListItem.Content>
                                </ListItem>

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
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

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
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

                    <Card
                        containerStyle={{
                            backgroundColor: Colors.PlexBlack,
                            borderColor: Colors.White,
                            borderWidth: 1
                        }}
                    >
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
                                containerStyle={{
                                    backgroundColor: Colors.PlexBlack
                                }}
                                icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                                expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            >
                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <View style={this.localStyle.updateAllView}>
                                            <Button
                                                title='Download the databases'
                                                color='#e5a00d'
                                                onPress={() => {
                                                    Linking.openURL(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/diagnostics/databases/?X-Plex-Token=${this.state.server.token}`);
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
                                                    Linking.openURL(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/diagnostics/logs/?X-Plex-Token=${this.state.server.token}`);
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
