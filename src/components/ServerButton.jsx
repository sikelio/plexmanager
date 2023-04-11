// Dependencies
import React from 'react';
// Components
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
// Styles
import style from '../style/ServerStyle';

const ServerButton = ({iconName, iconColor, backgroundColor, btnTitle, onPress }) => {
    return (
        <Button
            icon={
                <Icon
                    name={ iconName }
                    color={ iconColor }
                    size={ 16 }
                    style={ [style.cardBtn] }
                />
            }
            buttonStyle={{
                backgroundColor: backgroundColor
            }}
            title={ btnTitle }
            onPress={ onPress }
        />
    );
}

export default ServerButton;
