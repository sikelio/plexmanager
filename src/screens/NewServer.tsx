// Dependencies
import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
// Style
import style from "../style/NewServerStyle";

const NewServer = () => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            ip: '',
            port: '3306'
        }
    });

    const onSubmit = (data: Object) => {
        console.log(data);
    }

    return (
        <View>
            <Controller
                control={ control }
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={ [style.input] }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="NAME"
                        placeholderTextColor="#000"
                    />
                )}
                name="name"
            />
            { errors.name && <Text style={ [style.required] }>Name is required.</Text> }

            <Controller
                control={ control }
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={ [style.input] }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        keyboardType="numeric"
                        placeholder="IP"
                        placeholderTextColor="#000"
                    />
                )}
                name="ip"
            />
            { errors.ip && <Text style={ [style.required] }>IP is required.</Text> }

            <Controller
                control={ control }
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={ [style.input] }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        keyboardType="numeric"
                        placeholder="PORT"
                        placeholderTextColor="#000"
                    />
                )}
                name="port"
            />
            { errors.port && <Text style={ [style.required] }>Port is required.</Text> }

            <Button title="Submit" onPress={ handleSubmit(onSubmit) } />
        </View>
    );
}

export default NewServer;
