import AsyncStorage from '@react-native-async-storage/async-storage';

const storeServer = async (data: Object) => {
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

const getServer = async () => {
    try {
        return await AsyncStorage.getItem('servers');
    } catch (e) {
        console.error(e)
    }
}

const resetServer = async () => {
    try {
        return await AsyncStorage.setItem('servers', JSON.stringify([]));
    } catch (e) {
        console.error(e)
    }
}

export { storeServer, getServer, resetServer };
