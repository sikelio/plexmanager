import {
    Text,
    TextInput,
    Alert,
    Linking, View, StyleSheet,
} from "react-native";
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Formik } from 'formik';
import { storeServer } from "../functions/ServerStorage";

export default class NewServer extends React.Component {
    protocolOptions = [
        { label: 'HTTP', value: 'http' },
        { label: 'HTTPS', value: 'https' }
    ];

    serverTypeOptions = [
        { label: 'Computer', value: 'computer' },
        { label: 'NAS', value: 'nas' }
    ];

    localStyle = StyleSheet.create({
        input: {
            height: 55,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 17.5,
            paddingRight: 17.5,
            fontSize: 15
        },
        picker: {
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingLeft: 10
        },
        required: {
            color: '#e5a00d',
            fontWeight: 'bold',
            fontSize: 15
        },
        sendBtn: {
            marginRight: 10
        },
        helpLink: {
            textDecorationLine: 'underline',
            marginBottom: 10,
            color: 'black'
        }
    });

    constructor() {
        super();

        this.state = {
            protocol: 'http',
            serverType: 'computer',
            name: '',
            ip: '',
            port: '32400',
            token: ''
        }
    }

    async saveServer(values) {
        try {
            await storeServer(values);

            Alert.alert('Success', 'Server was correctly added!');
        } catch (e) {
            Alert.alert(
                'Error',
                `Something went wrong!\nIf the error persist leave a issue on my repo.\n\nhttps://github.com/sikelio/plexmanager/issues`
            );
        }
    }

    validate(values) {
        const ipDomainRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
        const errors = {};

        if (!values.name) {
            errors.name = 'Server name is required!'
        }

        if (!values.ip) {
            errors.ip = 'Server IP or Hostname is required!'
        }

        if (!values.port) {
            errors.port = 'Server port is required';
        }

        if (!values.token) {
            errors.token = 'Server token is required!'
        }

        if (!ipDomainRegex.test(values.ip)) {
            errors.ip = 'Entered IP or Hostname is invalid!\nValid format: xxx.xxx.xxx.xxx or domain.extension';
        }

        if (isNaN(values.port)) {
            errors.port = 'Port must be a number!';
        }

        if (values.port < 0 || values.port > 65535) {
            errors.port = 'Entered port is invalid!\nThe port range is between 0 and 65535.';
        }

        return errors;
    }

    render() {
        return (
            <Formik
                initialValues={this.state}
                onSubmit={this.saveServer}
                validate={this.validate}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, resetForm }) => (
                    <View
                        style={{padding: 20}}
                    >
                        <View
                            style={this.localStyle.picker}
                        >
                            <Picker
                                selectedValue={values.serverProtocol}
                                onValueChange={handleChange('protocol')}
                            >
                                {this.protocolOptions.map(option => (
                                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>

                        <View
                            style={this.localStyle.picker}
                        >
                            <Picker
                                selectedValue={values.serverType}
                                onValueChange={handleChange('serverType')}
                            >
                                {this.serverTypeOptions.map(option => (
                                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                                ))}
                            </Picker>
                        </View>

                        <View>
                            {errors.name && <Text style={this.localStyle.required}>{errors.name}</Text>}
                            <TextInput
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                value={values.name}
                                placeholder={'Server Name'}
                                style={this.localStyle.input}
                            />
                        </View>

                        <View>
                            {errors.ip && <Text style={this.localStyle.required}>{errors.ip}</Text>}
                            <TextInput
                                onChangeText={handleChange('ip')}
                                onBlur={handleBlur('ip')}
                                value={values.ip}
                                placeholder={'IP / Hostname'}
                                style={this.localStyle.input}
                            />
                        </View>

                        <View>
                            {errors.port && <Text style={this.localStyle.required}>{errors.port}</Text>}
                            <TextInput
                                onChangeText={handleChange('port')}
                                onBlur={handleBlur('port')}
                                value={values.port}
                                placeholder={'Port'}
                                style={this.localStyle.input}
                                keyboardType='numeric'
                            />
                        </View>

                        <View>
                            {errors.token && <Text style={this.localStyle.required}>{errors.token}</Text>}
                            <TextInput
                                onChangeText={handleChange('token')}
                                onBlur={handleBlur('token')}
                                value={values.token}
                                placeholder={'Token'}
                                style={this.localStyle.input}
                                secureTextEntry={true}
                            />

                            <View
                                style={{
                                    alignItems: 'center'
                                }}
                            >
                                <Text
                                    onPress={() => Linking.openURL('https://github.com/sikelio/plexmanager/wiki/Getting-Plex-Media-Server-Access-Token')}
                                    style={this.localStyle.helpLink}
                                >
                                    How to I get my Plex Token ?
                                </Text>
                            </View>
                        </View>

                        <Button
                            title={'Submit'}
                            color='#e5a00d'
                            onPress={() => {
                                handleSubmit();
                                resetForm();
                            }}
                            icon={
                                <Icon
                                    name={'paper-plane'}
                                    color={'#ffffff'}
                                    size={16}
                                    style={this.localStyle.sendBtn}
                                    solid
                                />
                            }
                        />
                    </View>
                )}
            </Formik>
        );
    }
}
