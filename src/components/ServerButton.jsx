import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome5';

class ServerButton extends React.Component {
    localStyle = StyleSheet.create({
        cardBtn: {
            marginRight: 10
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            iconName: this.props.iconName,
            iconColor: this.props.iconColor,
            backgroundColor: this.props.backgroundColor,
            btnTitle: this.props.btnTitle,
            onPress: this.props.onPress
        };
    }

    render() {
        return (
            <Button
                icon={
                    <Icon
                        name={this.state.iconName}
                        color={this.state.iconColor}
                        size={16}
                        style={this.localStyle.cardBtn}
                    />
                }
                buttonStyle={{
                    backgroundColor: this.state.backgroundColor
                }}
                title={this.state.btnTitle}
                onPress={this.state.onPress}
            />
        );
    }
}

export default ServerButton;
