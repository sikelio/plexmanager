import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

class SingleSession extends React.Component {
    reason = 'RTFM';

    localStyle = StyleSheet.create({
        mainContainer: {
            flex: 1
        }
    })

    constructor(props) {
        super(props);

        this.state = {
            server: this.props.route.params.server,
            session: this.props.route.params.session
        };
    }

    render() {
        return (
            <View
                style={this.localStyle.mainContainer}
            >
            </View>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <SingleSession {...props} navigation={navigation} />;
};
