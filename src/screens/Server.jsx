// Dependencies
import React, { useState } from 'react';
// Components
import { ScrollView, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import ServerList from '../components/ServerList';
// Functions
import { getServer } from '../functions/ServerStorage';
// Styles
import style from '../style/ServerStyle';

const Server = ( { navigation } ) => {
    const [ serverList, setServerList ] = useState([]);
    const [ spinner, setSpinner ] = useState(false);

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

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const refreshServerList = () => {
        fetchData();
    };

    let isServerListEmpty = serverList.length === 0;

    return (
        <View style={ [style.mainContainer] }>
            <Spinner
                visible={ spinner }
                textContent={'Loading...'}
            />

            <ScrollView>
                <View>
                    <ServerList
                        data={ serverList }
                        isEmpty={ isServerListEmpty }
                        navigation={ navigation }
                        refreshServerList={ refreshServerList }
                        setSpinner={ setSpinner }
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export default Server;
