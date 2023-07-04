// Components
import {
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Linking
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';
// Functions
import { editServer, ipDomainRegex } from '../functions/ServerStorage';
// Styles
import style from '../style/NewServerStyle';

const protocolOptions = [
    { label: 'HTTP', value: 'http' },
    { label: 'HTTPS', value: 'https' }
];

const serverTypeOptions = [
    { label: 'Computer', value: 'computer' },
    { label: 'NAS', value: 'nas' }
]

const EditServer = ({ route, navigation }) => {
    const { server } = route.params;

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            protocol: server.protocol,
            serverType: server.serverType,
            name: server.name,
            ip: server.ip,
            port: server.port,
            token: server.token
        }
    });

    const onSubmit = (data) => {
        if (!ipDomainRegex(data.ip)) {
            return Alert.alert(
                'Invalid IP or Domain',
                'You have enter an invalid IP or Domain'
            );
        }

        editServer(data, route.params.index).then(() => {
            Alert.alert('Success', 'Server edited', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Server');
                    }
                }
            ]);
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
                defaultValue={ server.protocol }
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
                defaultValue={ server.serverType }
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
                        keyboardType="numeric"
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

            <Text
                onPress={() => Linking.openURL('https://github.com/sikelio/plexmanager/wiki/Getting-Plex-Media-Server-Access-Token')}
                style={ [style.helpLink] }
            >
                How to I get my Plex Token ?
            </Text>

            <Button
                title="Save"
                color="#e5a00d"
                onPress={ handleSubmit(onSubmit) }
                icon={
                    <Icon
                        name={ 'save' }
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

export default EditServer;
