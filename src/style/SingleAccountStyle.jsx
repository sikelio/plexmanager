// Dependencies
import React from "react";
// Components
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginVertical: 2.5
    },
    userPreferencesLabel: {
        width: '50%',
        color: '#000000'
    },
    userPreferencesValue: {
        width: '50%',
        color: '#000000'
    }
});

export default style;
