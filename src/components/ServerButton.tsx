// Dependencies
import React from 'react';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';
// Style
import style from '../style/ServerStyle';

interface ServerButtonProps {
    iconName: string;
    iconColor: string;
    backgroundColor: string;
    btnTitle: string;
}

const ServerButton: React.FC<ServerButtonProps> = ({ iconName, iconColor, backgroundColor, btnTitle }) => {
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
        />
    );
}

export default ServerButton;
