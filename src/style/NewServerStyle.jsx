// Dependencies
import React from "react";
// Components
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        color: '#000',
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        width: '100%'
    },
    picker: {
        color: '#000',
        backgroundColor: '#FFF',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
        width: '100%'
    },
    required: {
        color: '#e5a00d',
        fontWeight: 'bold'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        color: '#000',
        marginBottom: 15,
        textAlign: 'center',
    },
    sendBtn: {
        marginRight: 10
    }
});

export default style;
