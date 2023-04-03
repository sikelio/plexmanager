// Dependencies
import React from 'react';
import { Button, Icon } from '@rneui/themed';

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
                    name={iconName}
                    color={iconColor}
                    iconStyle={{ marginRight: 10 }}
                />
            }
            buttonStyle={{
                backgroundColor: backgroundColor
            }}
            title={btnTitle}
        />
    );
}

export default ServerButton;
