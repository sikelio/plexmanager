import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { Card, ListItem } from "@rneui/themed";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

class Activities extends React.Component {
    localStyle = StyleSheet.create({
        manageContainer: {
            flex: 1
        },
        serverIdLabel: {
            fontWeight: 'bold'
        },
        serverIdValue: {
            color: '#000000'
        },
        item: {
            color: '#000',
            width: '33%'
        },
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14
        },
        updateAllView: {
            width: '100%'
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            activities: this.props.route.params.activities,
            server: this.props.route.params.server,
            activitiesList: true,
            refreshing: false
        };

        this.refresh = this.refresh.bind(this);
    }

    async fetchActivities() {
        try {
            const activities = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/activities?X-Plex-Token=${this.state.server.token}`);

            this.setState({ activities: activities.data.MediaContainer });
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Somenthing went wront during activities fetch!');
        }
    }

    refresh() {
        this.setState({ refreshing: true });

        this.fetchActivities()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                }
            >
                <Card>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={this.localStyle.accordionTitle}>Activities</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={this.state.activitiesList}
                        onPress={() => {
                            this.setState({ activitiesList: !this.state.activitiesList });
                        }}
                    >
                        {this.state.activities.size === 0 ? (
                            <ListItem>
                                <ListItem.Content>
                                    <ListItem.Title>No activities</ListItem.Title>
                                </ListItem.Content>
                            </ListItem>
                        ) : (
                            this.state.activities.Activity.map((activity, index) => {
                                return (
                                    <ListItem
                                            key={index}
                                            bottomDivider
                                            // onPress={() => {
                                            //     this.props.navigation.navigate('SingleSession', {
                                            //         title: session.Session.id,
                                            //         server: this.state.server,
                                            //         session: session
                                            //     });
                                            // }}
                                        >
                                            <ListItem.Content>
                                                <ListItem.Title>{activity.title}</ListItem.Title>
                                                <ListItem.Subtitle>Progress: {activity.progress}%</ListItem.Subtitle>
                                                <ListItem.Subtitle>Type: {activity.type}</ListItem.Subtitle>
                                                <ListItem.Subtitle>UUID: {activity.uuid}</ListItem.Subtitle>
                                                <ListItem.Subtitle>Cancellable: {activity.cancellable.toString()}</ListItem.Subtitle>
                                            </ListItem.Content>

                                            <ListItem.Chevron color='black' />
                                        </ListItem>
                                );
                            })
                        )}
                    </ListItem.Accordion>
                </Card>
            </ScrollView>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <Activities {...props} navigation={navigation} />;
};
