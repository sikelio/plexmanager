import React, { useState } from "react";
import { Button, ScrollView, View, Text } from "react-native";
import { Card, ListItem } from '@rneui/themed';
import { sendRequest } from "../functions/ServerRequest";
import style from "../style/ServerManageStyle"

const ServerManage = ({ route }) => {
    const server = route.params.server;
    const libraries = route.params.libraries;
    const users = route.params.users;

    const [ userList, setUserList ] = useState(false);

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
                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/all/refresh?X-Plex-Token=${server.token}`);
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
                                    { lib.title }
                                </Text>

                                <View style={ [style.item] }>
                                    <Button
                                        title="Update"
                                        color='#e5a00d'
                                        onPress={() => {
                                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${lib.key}/refresh?X-Plex-Token=${server.token}`);
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
        </ScrollView>
    );
}

export default ServerManage;
