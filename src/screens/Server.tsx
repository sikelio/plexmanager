// Dependencies
import React, { useEffect, useState } from "react";
import { ScrollView, View } from 'react-native';
// Components
import ServerList from "../components/ServerList";
// Functions
import { getServer } from "../functions/ServerStorage";
// Style
import style from "../style/ServerStyle";

interface Server {
    name: string;
    ip: string;
    port: number;
}

const Server = () => {
    const [serverList, setServerList] = useState<Server[]>([]);

    useEffect(() => {
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
    }, []);

    let isServerListEmpty: boolean = serverList.length == 0;

    return (
        <View style={ [style.mainContainer] }>
            <ScrollView>
                <View>
                    <ServerList data={ serverList } isEmpty={ isServerListEmpty } />
                </View>
            </ScrollView>
        </View>
    );
}

export default Server;