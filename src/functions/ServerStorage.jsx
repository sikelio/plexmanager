// Dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store a server in array
 * @param data Servers data
 */
export const storeServer = async (data) => {
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
 * Edit stored server
 * @param data Edited server data
 * @param index Servers index
 */
export const editServer = async (data, index) => {
    const serverStorage = await AsyncStorage.getItem('servers');

    if (serverStorage == null) {
        await AsyncStorage.setItem('servers', JSON.stringify([data]));
    } else {
        const rawData = JSON.parse(serverStorage);
        rawData[index] = data;

        await AsyncStorage.setItem('servers', JSON.stringify(rawData));
    }
}

/**
 * Get server list
 */
export const getServer = async () => {
    let servers = await AsyncStorage.getItem('servers');

    if (servers === null) {
        servers = JSON.stringify([]);
    }

    return servers;
}

export const deleteServer = async (index) => {
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
export const resetServer = async () => {
    try {
        return await AsyncStorage.setItem('servers', JSON.stringify([]));
    } catch (e) {
        console.error(e)
    }
}
