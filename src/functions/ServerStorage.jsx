import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store a server in array
 * @param data Server data
 */
const storeServer = async (data) => {
    try {
        const serverStorage = await AsyncStorage.getItem('servers');

        if (serverStorage == null) {
            await AsyncStorage.setItem('servers', JSON.stringify([data]));
        } else {
            const rawData = JSON.parse(serverStorage);
            rawData.push(data);

            await AsyncStorage.setItem('servers', JSON.stringify(rawData));
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * Get server list
 */
const getServer = async () => {
    try {
        return await AsyncStorage.getItem('servers');
    } catch (e) {
        console.error(e)
    }
}

const deleteServer = async (index) => {
    try {
        let servers = await AsyncStorage.getItem('servers');
        if (servers != null) {
            let data = JSON.parse(servers);
            data.splice(index, 1);

            return await AsyncStorage.setItem('servers', JSON.stringify(data));
        }
    } catch (e) {
        console.error(e);
    }
}

/**
 * Delete all server from list
 */
const resetServer = async () => {
    try {
        return await AsyncStorage.setItem('servers', JSON.stringify([]));
    } catch (e) {
        console.error(e)
    }
}

export { storeServer, getServer, deleteServer, resetServer };
