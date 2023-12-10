import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { deleteServer, getServer } from '../functions/ServerStorage';
import { Card, Text } from '@rneui/themed';
import ServerButton from '../components/ServerButton';
import axios from 'axios';
import Colors from '../utiles/Colors';
import { addEventListener } from '@react-native-community/netinfo';

class Servers extends React.Component {
    localStyle = StyleSheet.create({
        mainContainer: {
            flex: 1
        },
        srvButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
        },
        textColor: {
            color: Colors.White,
            marginBottom: 10
        },
        textLabel: {
            fontWeight: 'bold',
            color: Colors.PlexYellow
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            serverList: [],
            spinner: false,
            refreshing: false,
            isServerListEmpty: true,
            connected: false
        };

        this.refresh = this.refresh.bind(this);
    }

    async fetchServers() {
        try {
            const servers = JSON.parse(await getServer());

            if (servers.length > 0) {
                this.setState({ isServerListEmpty: false });
                this.setState({ serverList: servers });
            } else {
                this.setState({ isServerListEmpty: true });
            }
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during servers fetch!');
        }
    }

    async refreshServerList() {
        await this.fetchServers();
    }

    async componentDidMount() {
        addEventListener(state => {
            this.setState({ connected: state.isConnected });
        });

        await this.fetchServers();

        this.props.navigation.addListener('focus', async () => {
            await this.fetchServers();
        });
    }

    refresh() {
        this.setState({ refreshing: true });

        this.fetchServers()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        return (
            <View style={this.localStyle.mainContainer}>
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
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.refresh}
                            colors={[Colors.PlexYellow]}
                        />
                    }
                    style={{
                        backgroundColor: Colors.PlexGrey
                    }}
                >
                    <View>
                        {this.state.isServerListEmpty === true ? (
                            <View>
                                <Card
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack,
                                        borderColor: Colors.White,
                                        borderWidth: 1
                                    }}
                                >
                                    <Card.Title
                                        style={{
                                            color: Colors.PlexYellow
                                        }}
                                    >
                                        No server
                                    </Card.Title>
                                    <Card.Divider></Card.Divider>
                                    <View>
                                        <Text
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            Add one in the "New Server" tab
                                        </Text>
                                    </View>
                                </Card>
                            </View>
                        ) : (
                            this.state.serverList.map((server, index) => (
                                <Card
                                    key={index}
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack,
                                        borderColor: Colors.White,
                                        borderWidth: 1
                                    }}
                                >
                                    <Card.Title
                                        style={{
                                            color: Colors.PlexYellow
                                        }}
                                    >
                                        {server.name}
                                    </Card.Title>
                                    <Card.Divider />
                                    <View key={index}>
                                        <Text style={this.localStyle.textColor}>
                                            <Text style={this.localStyle.textLabel}>PROTOCOL: </Text>
                                            {server.protocol.toUpperCase()}
                                        </Text>

                                        <Text style={this.localStyle.textColor}>
                                            <Text style={this.localStyle.textLabel}>IP: </Text>
                                            {server.ip}
                                        </Text>

                                        <Text style={this.localStyle.textColor}>
                                            <Text style={this.localStyle.textLabel}>PORT: </Text>
                                            {server.port}
                                        </Text>

                                        <View style={this.localStyle.srvButtonContainer}>
                                            <ServerButton
                                                iconName={'wrench'}
                                                iconColor={'#ffffff'}
                                                backgroundColor={'#e5a00d'}
                                                btnTitle={'Manage'}
                                                onPress={async () => {
                                                    if (this.state.connected === false) {
                                                        return Alert.alert('Network error', 'You are not connected to internet!');
                                                    }

                                                    this.setState({ spinner: true });

                                                    axios.interceptors.response.use(
                                                        response => response,
                                                        error => {
                                                            if (!error.response) {
                                                                return Promise.reject(new Error('Network Error'));
                                                            }

                                                            return Promise.reject(error);
                                                        }
                                                    );

                                                    try {
                                                        const [
                                                            plexInfoApi,
                                                            libraries,
                                                            users,
                                                            identity,
                                                            devices,
                                                            sessionHistory
                                                        ] = await Promise.all([
                                                            axios.get('https://plex.tv/api/downloads/5.json'),
                                                            axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`),
                                                            axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`),
                                                            axios.get(`${server.protocol}://${server.ip}:${server.port}/?X-Plex-Token=${server.token}`),
                                                            axios.get(`${server.protocol}://${server.ip}:${server.port}/devices/?X-Plex-Token=${server.token}`),
                                                            axios.get(`${server.protocol}://${server.ip}:${server.port}/status/sessions/history/all?X-Plex-Token=${server.token}`)
                                                        ]);

                                                        this.props.navigation.navigate('SingleServer', {
                                                            title: server.name,
                                                            plexInfo: plexInfoApi.data[server.serverType][identity.data.MediaContainer.platform],
                                                            server: server,
                                                            libraries: libraries.data.MediaContainer.Directory,
                                                            users: users.data.MediaContainer.Account,
                                                            identity: identity.data.MediaContainer,
                                                            devices: devices.data.MediaContainer.Device,
                                                            sessionHistory: sessionHistory.data.MediaContainer
                                                        });
                                                    } catch (e) {
                                                        if (e.message === 'Network Error') {
                                                            Alert.alert(
                                                                'Network Error',
                                                                'Please check your network connection and try again.',
                                                                [{ text: 'OK' }]
                                                            );
                                                        } else if (e.response && e.response.status === 401) {
                                                            Alert.alert(
                                                                'Unauthorized',
                                                                'It seems you are unauthorized, check if you\'re plex token is valid.',
                                                                [{ text: 'OK' }]
                                                            );
                                                        } else {
                                                            Alert.alert(
                                                                'Error',
                                                                'Something went wrong, check all credentials you have provided.',
                                                                [{ text: 'OK' }]
                                                            );
                                                        }
                                                    }

                                                    this.setState({ spinner: false });
                                                }}
                                            />

                                            <ServerButton
                                                iconName={'pen'}
                                                iconColor={'#ffffff'}
                                                backgroundColor={'#e5a00d'}
                                                btnTitle={'Edit'}
                                                onPress={() => {
                                                    this.props.navigation.navigate('EditServer', {
                                                        title: server.name,
                                                        server: server,
                                                        index: index
                                                    });
                                                }}
                                            />

                                            <ServerButton
                                                iconName={'trash'}
                                                iconColor={'#ffffff'}
                                                backgroundColor={'#ff0000'}
                                                btnTitle={'Delete'}
                                                onPress={() => {
                                                    Alert.alert('Confirmation', 'Are you sure you want to delete this server ?', [
                                                        {
                                                            text: 'Delete',
                                                            style: 'destructive',
                                                            onPress: async () => {
                                                                await deleteServer(index);
                                                                await this.refreshServerList();
                                                            }
                                                        }, {
                                                            text: 'Cancel',
                                                            style: 'cancel'
                                                        }
                                                    ]);
                                                }}
                                            />
                                        </View>
                                    </View>
                                </Card>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <Servers {...props} navigation={navigation} />;
};
