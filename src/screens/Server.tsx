// Dependencies
import React from "react";
import { ScrollView, View, Image } from 'react-native';
import { FAB } from '@rneui/themed';
// Components
import ServerList from "../components/ServerList";
// Style
import style from "../style/ServerStyle";
import NewServer from "./NewServer";

interface Server {
    name: string;
    ip: string;
    port: number;
}

const data: Server[] = [
    {
        name: 'SRV-1',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }, {
        name: 'SRV-2',
        ip: '127.0.0.1',
        port: 3306
    }
];

const Server = () => {
    return (
        <View style={ [style.mainContainer] }>
            <ScrollView>
                <View>
                    <ServerList data={ data } />
                </View>
            </ScrollView>

            <FAB
                placement="right"
                visible={ true }
                icon={{ name: 'add', color: '#282a2d' }}
                size="large"
                color="orange"
            />
        </View>
    );
}

export default Server;