// Dependencies
import React from 'react';
import { Text, Card } from '@rneui/themed';
import { View } from 'react-native';
import ServerButton from './ServerButton';
import { deleteServer } from '../functions/ServerStorage';
import style from '../style/ServerStyle';
import axios from "axios";

const ServerCard = ({ server, index, navigation, refreshServerList }) => {
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
                            const libraries = await axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`);
                            const users = await axios.get(`${server.protocol}://${server.ip}:${server.port}/accounts/?X-Plex-Token=${server.token}`);

                            navigation.navigate('ServerManage', {
                                title: server.name,
                                server: server,
                                libraries: libraries.data.MediaContainer.Directory,
                                users: users.data.MediaContainer.Account
                            });
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
