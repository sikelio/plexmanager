import React from 'react';
import { Text, ScrollView, View, StyleSheet } from 'react-native';
import { Card } from '@rneui/themed';
import { useNavigation } from "@react-navigation/native";

class ScheduledTasks extends React.Component {
    localStyle = StyleSheet.create({
        textColor: {
            color: '#000'
        },
        textLabel: {
            fontWeight: 'bold'
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            scheduledTasks: this.props.route.params.scheduledTasks
        };
    }

    render() {
        return (
            <ScrollView>
                {this.state.scheduledTasks.map((task, index) => {
                    return (
                        <Card
                            key={index}
                        >
                            <Card.Title>{task.name}</Card.Title>
                            <Card.Divider />
                            <View>
                                <Text style={this.localStyle.textColor}>
                                    <Text style={this.localStyle.textLabel}>Description : </Text>
                                    {task.description ? task.description : 'none'}
                                </Text>
                                <Text style={this.localStyle.textColor}>
                                    <Text style={this.localStyle.textLabel}>Schedule randomized : </Text>
                                    {task.scheduleRandomized.toString()}
                                </Text>
                                <Text style={this.localStyle.textColor}>
                                    <Text style={this.localStyle.textLabel}>Interval : </Text>
                                    {task.interval}
                                </Text>
                            </View>
                        </Card>
                    );
                })}
            </ScrollView>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <ScheduledTasks {...props} navigation={navigation} />;
};
