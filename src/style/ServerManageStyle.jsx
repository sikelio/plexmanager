// Dependencies
import React from "react";
// Components
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginVertical: 2.5
    },
    item: {
        color: '#000',
        width: '50%'
    },
    accordionTitle: {
        fontWeight: 'bold',
        fontSize: 14
    }
});

export default style;
