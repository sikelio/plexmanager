// Dependencies
import React from 'react';
import { Text, Card } from '@rneui/themed';
import { View } from 'react-native';
// Components
import ServerButton from './ServerButton';
// Styles
import style from '../style/ServerStyle';

interface ServerCardProps {
    server: {
        name: string;
        ip: string;
        port: number;
    };
    index: number;
}

const ServerCard: React.FC<ServerCardProps> = ({ server, index }) => {
    return (
        <Card key={ index }>
            <Card.Title>{ server.name }</Card.Title>
            <Card.Divider />
            <View key={ index }>
                <Text>IP : { server.ip }</Text>
                <Text>PORT : { server.port }</Text>
                <Card.Divider />
                <View style={ [style.srvButtonContainer] }>
                    <ServerButton
                        iconName={ 'wrench' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#e5a00d' }
                        btnTitle={ 'Manage' }
                    />
                    <ServerButton
                        iconName={ 'pen' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#e5a00d' }
                        btnTitle={ 'Edit' }
                    />
                    <ServerButton
                        iconName={ 'trash' }
                        iconColor={ '#ffffff' }
                        backgroundColor={ '#ff0000' }
                        btnTitle={ 'Delete' }
                    />
                </View>
            </View>
        </Card>
    );
}

export default ServerCard;
