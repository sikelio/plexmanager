// Components
import {
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
// Functions
import { ipDomainRegex, storeServer } from '../functions/ServerStorage';
// Styles
import style from '../style/NewServerStyle';

const protocolOptions = [
    { label: 'HTTP', value: 'http' },
    { label: 'HTTPS', value: 'https' }
];

const serverTypeOptions = [
    { label: 'Computer', value: 'computer' },
    { label: 'NAS', value: 'nas' }
];

const NewServer = () => {
    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            protocol: 'http',
            serverType: 'computer',
            name: '',
            ip: '',
            port: '32400',
            token: ''
        }
    });

    const onSubmit = (data) => {
        if (!ipDomainRegex(data.ip)) {
            return Alert.alert(
                'Invalid IP or Domain',
                'You have enter an invalid IP or Domain'
            );
        }

        storeServer(data).then(() => {
            Alert.alert('Success', 'Server saved');
            reset();
        });
    }

    return (
        <KeyboardAvoidingView
            behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
            style={ [style.container] }
        >
            { errors.protocol && <Text style={ style.required }>Protocol is required.</Text> }
            <Controller
                control={ control }
                name="protocol"
                defaultValue="http"
                render={({ field: { onChange, value } }) => (
                    <Picker
                        selectedValue={ value }
                        onValueChange={ onChange }
                        style={ [style.picker] }
                    >
                        {protocolOptions.map((option) => (
                            <Picker.Item key={ option.value } label={ option.label } value={ option.value } />
                        ))}
                    </Picker>
                )}
            />

            { errors.serverType && <Text style={ style.required }>Server type is required.</Text> }
            <Controller
                control={ control }
                name="serverType"
                defaultValue="computer"
                render={({ field: { onChange, value } }) => (
                    <Picker
                        selectedValue={ value }
                        onValueChange={ onChange }
                        style={ [style.picker] }
                    >
                        {serverTypeOptions.map((option) => (
                            <Picker.Item key={ option.value } label={ option.label } value={ option.value } />
                        ))}
                    </Picker>
                )}
            />

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
                        keyboardType='numeric'
                        placeholder="PORT"
                        placeholderTextColor="#6B6B6B"
                    />
                )}
                name="port"
            />

            { errors.token && <Text style={ style.required }>Token is required.</Text> }
            <Controller
                control={ control }
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={ [style.input] }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="TOKEN"
                        placeholderTextColor="#6B6B6B"
                        secureTextEntry={ true }
                    />
                )}
                name="token"
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
