// Dependencies
import React from 'react';
// Components
import { View } from 'react-native';
import { Text, Card } from '@rneui/themed';
import ServerCard from './ServerCard';

const ServerList = ({ data, isEmpty, navigation, refreshServerList, setSpinner }) => {
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
            {data.map((server, index) => (
                <ServerCard
                    server={ server }
                    index={ index }
                    key={ index }
                    navigation={ navigation }
                    refreshServerList={ refreshServerList }
                    setSpinner={ setSpinner }
                />
            ))}
        </View>
    );
};

export default ServerList;
