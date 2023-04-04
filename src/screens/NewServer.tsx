// Dependencies
import React, { useState } from 'react';
import {
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert,
    View,
    Pressable
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
// Functions
import { storeServer, resetServer } from '../functions/ServerStorage';
// Style
import style from '../style/NewServerStyle';

const NewServer = () => {
    const [ modalVisible, setModalVisible ] = useState(false);

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: '',
            ip: '',
            port: '3306'
        }
    });

    const onSubmit = (data: Object) => {
        storeServer(data).then(() => {
            setModalVisible(true);
            reset();
        });
    }

    return (
        <KeyboardAvoidingView
            behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
            style={ style.container }
        >
            <Modal
                animationType="slide"
                transparent={ true }
                visible={ modalVisible }
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={ style.centeredView }>
                    <View style={ style.modalView }>
                        <Text style={ style.modalText }>Server saved</Text>
                        <Pressable
                            style={ [style.button, style.buttonClose] }
                            onPress={ () => setModalVisible(!modalVisible) }
                        >
                            <Text style={ style.textStyle }>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            { errors.name && <Text style={ style.required }>Name is required.</Text> }
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
                        placeholderTextColor="#6B6B6B"
                    />
                )}
                name="name"
            />

            { errors.ip && <Text style={ style.required }>IP is required.</Text> }
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
                        placeholderTextColor="#6B6B6B"
                    />
                )}
                name="ip"
            />

            { errors.port && <Text style={ style.required }>Port is required.</Text> }
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
                        placeholderTextColor="#6B6B6B"
                    />
                )}
                name="port"
            />

            <Button
                title="Submit"
                color="#e5a00d"
                onPress={ handleSubmit(onSubmit) }
                icon={
                    <Icon
                        name={ 'paper-plane' }
                        color={ '#ffffff' }
                        size={ 16 }
                        style={ [style.sendBtn] }
                        solid
                    />
                }
            />
        </KeyboardAvoidingView>
    );
}

export default NewServer;
