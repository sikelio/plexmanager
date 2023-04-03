// Dependencies
import React from 'react';
import { View } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
// Style
import style from "../style/ServerStyle";

interface Server {
    name: string;
    ip: string;
    port: number;
}

interface Props {
    data: Server[];
}

const ServerList: React.FC<Props> = ({ data }) => {
    return (
        <View>
            {data.map((server: Server, index: number) => (
                <Card key={ index }>
                    <Card.Title>{ server.name }</Card.Title>
                    <Card.Divider />
                    <View key={ index }>
                        <Text>IP : { server.ip }</Text>
                        <Text>PORT : { server.port }</Text>
                        <Card.Divider />
                        <View style={ [style.srvButtonContainer] }>
                            <Button
                                icon={
                                    <Icon
                                        name="edit"
                                        color="#ffffff"
                                        iconStyle={{ marginRight: 10 }}
                                    />
                                }
                                buttonStyle={{
                                    backgroundColor: "#e5a00d"
                                }}
                                title="Edit"
                            />
                            <Button
                                icon={
                                    <Icon
                                        name="delete"
                                        color="#ffffff"
                                        iconStyle={{ marginRight: 10 }}
                                    />
                                }
                                buttonStyle={{
                                    backgroundColor: "#ff0000"
                                }}
                                title="Delete"
                            />
                        </View>
                    </View>
                </Card>
            ))}
        </View>
    );
};

export default ServerList;