// Dependencies
import React from "react";
import axios from "axios";
// Components
import { Alert } from "react-native";

export const sendRequest = (url) => {
    axios.get(url).then((data) => {
        Alert.alert('Success', 'Request sent');
    }).catch((err) => {
        Alert.alert('Error', 'Something went wrong');
    });
}

export const sendPutRequest = (url) => {
    axios.put(url).then((data) => {
        Alert.alert('Success', 'Request sent');
    }).catch((err) => {
        Alert.alert('Error', 'Something went wrong');
    });
}
