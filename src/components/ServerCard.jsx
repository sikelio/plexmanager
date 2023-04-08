// Dependencies
import React from 'react';
import { Text, Card } from '@rneui/themed';
import { View } from 'react-native';
import ServerButton from './ServerButton';
import { deleteServer } from '../functions/ServerStorage';
import style from '../style/ServerStyle';
import axios from "axios";

const ServerCard = ({ server, index, navigation }) => {
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
                            const res = await axios.get(`${server.protocol}://${server.ip}:${server.port}/library/sections/?X-Plex-Token=${server.token}`);

                            navigation.navigate('ServerActions', { title: server.name, server: server, libraries: res.data.MediaContainer.Directory });
                        }}
                    />
                    <ServerButton
                        iconName={ 'pen' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#e5a00d' }
                        btnTitle={ 'Edit' }
                        onPress={() => {
                            console.log('pen')
                        }}
                    />
                    <ServerButton
                        iconName={ 'trash' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#ff0000' }
                        btnTitle={ 'Delete' }
                        onPress={async () => {
                            await deleteServer(index);
                        }}
                    />
                </View>
            </View>
        </Card>
    );
}

export default ServerCard;
