// Dependencies
import React from 'react';
import { View } from 'react-native';
import { Text, Card } from '@rneui/themed';
// Components
import ServerCard from './ServerCard';

interface Server {
    name: string;
    ip: string;
    port: number;
}

interface Props {
    data: Server[];
    isEmpty: boolean;
}

const ServerList: React.FC<Props> = ({ data, isEmpty }) => {
    if (isEmpty) {
        return (
            <View>
                <Card>
                    <Card.Title>No server</Card.Title>
                    <Card.Divider></Card.Divider>
                    <View>
                        <Text>Add one in the "New Server" tab</Text>
                    </View>
                </Card>
            </View>
        );
    }

    return (
        <View>
            {data.map((server: Server, index: number) => (
                <ServerCard server={server} index={index} />
            ))}
        </View>
    );
};

export default ServerList;