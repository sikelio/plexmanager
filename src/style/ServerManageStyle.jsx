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
    itemHalf: {
        width: '50%'
    },
    item: {
        color: '#000',
        width: '33%'
    },
    actionBtn: {
        width: '33%'
    },
    accordionTitle: {
        fontWeight: 'bold',
        fontSize: 14
    }
});

export default style;
