// Dependencies
import AsyncStorage from "@react-native-async-storage/async-storage";
// Components
import { Alert } from "react-native";

const getDarkmode = async () => {
    const value = await AsyncStorage.getItem('darkmode');

    if (JSON.parse(value) === null) {
        return false;
    }

    return JSON.parse(value);
}

const getDarkmodeSwitch = (setDarkmode) => {
    AsyncStorage.getItem('darkmode').then((value) => {
        if (value !== null) {
            setDarkmode(JSON.parse(value));
        } else {
            setDarkmode(false);
        }
    });
}

const saveDarkmode = async (value) => {
    try {
        await AsyncStorage.setItem('darkmode', JSON.stringify(value));
    } catch (error) {
        Alert.alert('Error', 'Something went wrong');
    }
};

export { saveDarkmode, getDarkmodeSwitch, getDarkmode }
