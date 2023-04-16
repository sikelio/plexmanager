// Dependencies
import React from 'react';
import axios from "axios";
// Components
import { Text, Card } from '@rneui/themed';
import { Alert, View } from 'react-native';
import ServerButton from './ServerButton';
// Functions
import { deleteServer } from '../functions/ServerStorage';
// Styles
import style from '../style/ServerStyle';

const ServerCard = ({ server, index, navigation, refreshServerList, setSpinner }) => {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (!error.response) {
                return Promise.reject(new Error('Network Error'));
            }
            return Promise.reject(error);
        }
    );

    return (
        <Card key={ index }>
            <Card.Title>{ server.name }</Card.Title>
            <Card.Divider />
            <View key={ index }>
                <Text>PROTOCOL : { server.protocol.toUpperCase() }</Text>
                <Text>IP : { server.ip }</Text>
                <Text>PORT : { server.port }</Text>
                <Card.Divider />
                <View style={ [style.srvButtonContainer] }>
                    <ServerButton
                        iconName={ 'wrench' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#e5a00d' }
                        btnTitle={ 'Manage' }
                        onPress={async () => {
                            setSpinner(true);

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
                                    activeSessions
                                ] = await Promise.all([
                                    axios.get('https://plex.tv/api/downloads/5.json'),
                                    axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`),
                                    axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`),
                                    axios.get(`${server.protocol}://${server.ip}:${server.port}/?X-Plex-Token=${server.token}`),
                                    axios.get(`${server.protocol}://${server.ip}:${server.port}/devices/?X-Plex-Token=${server.token}`),
                                    axios.get(`${server.protocol}://${server.ip}:${server.port}/status/sessions?X-Plex-Token=${server.token}`)
                                ]);

                                navigation.navigate('ServerManage', {
                                    title: server.name,
                                    plexInfo: plexInfoApi.data[server.serverType][identity.data.MediaContainer.platform],
                                    server: server,
                                    libraries: libraries.data.MediaContainer.Directory,
                                    users: users.data.MediaContainer.Account,
                                    identity: identity.data.MediaContainer,
                                    devices: devices.data.MediaContainer.Device,
                                    activeSessions: activeSessions.data.MediaContainer.Metadata
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

                            setSpinner(false);
                        }}
                    />
                    <ServerButton
                        iconName={ 'pen' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#e5a00d' }
                        btnTitle={ 'Edit' }
                        onPress={() => {
                            navigation.navigate('EditServer', {
                                title: server.name,
                                server: server,
                                index: index
                            });
                        }}
                    />
                    <ServerButton
                        iconName={ 'trash' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#ff0000' }
                        btnTitle={ 'Delete' }
                        onPress={() => {
                            deleteServer(index).then(() => {
                                refreshServerList();
                            })
                        }}
                    />
                </View>
            </View>
        </Card>
    );
}

export default ServerCard;
