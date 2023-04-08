import React, { useEffect, useState } from 'react';
import {Button, ScrollView, View} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ServerList from '../components/ServerList';
import { getServer } from '../functions/ServerStorage';
import style from '../style/ServerStyle';

const Server = ( { navigation } ) => {
    const [ serverList, setServerList ] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    const servers = await getServer();
                    if (servers) {
                        setServerList(JSON.parse(servers));
                    }
                } catch (e) {
                    console.error(e);
                }
            };
            fetchData();
        }, [])
    );

    let isServerListEmpty = serverList.length === 0;

    return (
        <View style={ [style.mainContainer] }>
            <ScrollView>
                <View>
                    <ServerList data={ serverList } isEmpty={ isServerListEmpty } navigation={ navigation } />
                </View>
            </ScrollView>
        </View>
    );
}

export default Server;
