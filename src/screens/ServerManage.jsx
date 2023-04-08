import React from "react";
import { Button, ScrollView, View, Alert, Text } from "react-native";
import axios from "axios";
import { Card } from '@rneui/themed';
import style from "../style/ServerManageStyle"

const ServerManage = ({ route }) => {
    const server = route.params.server;
    const libraries = route.params.libraries;

    const SendRequest = (url) => {
        axios.get(url).then((data) => {
            switch (data.status) {
                case 200:
                    Alert.alert('Success', 'Request sent')
                    break;
                default:
                    Alert.alert('Error', 'Something went wrong');
                    break;
            }
        }).catch((err) => {
            Alert.alert('Error', 'Something went wrong');
        });
    }

    return (
        <ScrollView>
            <Card key='Update all card'>
                <Card.Title>Scan all libraries</Card.Title>
                <Card.Divider />
                <View key='Update all'>
                    <Button
                        title='Update all'
                        color='#e5a00d'
                        onPress={() => {
                            SendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/all/refresh?X-Plex-Token=${server.token}`);
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
                                    {lib.title}
                                </Text>

                                <View style={ [style.item] }>
                                    <Button
                                        title="Update"
                                        color='#e5a00d'
                                        onPress={() => {
                                            SendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${lib.key}/refresh?X-Plex-Token=${server.token}`);
                                        }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </Card>
        </ScrollView>
    );
}

export default ServerManage;
