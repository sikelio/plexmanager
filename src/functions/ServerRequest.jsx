import React from "react";
import { Alert } from "react-native";
import axios from "axios";

const sendRequest = (url) => {
    axios.get(url).then((data) => {
        Alert.alert('Success', 'Request sent');
    }).catch((err) => {
        Alert.alert('Error', 'Something went wrong');
    });
}

export { sendRequest }
