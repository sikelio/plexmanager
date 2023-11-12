import React from 'react';
import axios from 'axios';
import { ScrollView, RefreshControl, Alert, StyleSheet } from 'react-native';
import { Card, ListItem, Avatar } from '@rneui/themed';
import Spinner from 'react-native-loading-spinner-overlay';
import { sessionTitle } from '../functions/ServerManageUtiles';
import { useNavigation } from '@react-navigation/native';

class ActiveSessions extends React.Component {
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
            sessions: this.props.route.params.sessions,
            activeSessionsList: true,
            refreshing: false,
            server: this.props.route.params.server
        };

        this.refresh = this.refresh.bind(this);
    }

    async fetchActiveSessions() {
        try {
            let activeSessions = await axios.get(`${this.state.server.protocol}://${this.state.server.ip}:${this.state.server.port}/status/sessions?X-Plex-Token=${this.state.server.token}`);

            this.setState({ sessions: activeSessions.data.MediaContainer.Metadata });
        } catch (e) {
            Alert.alert('Error', 'Something went wrong during active sessions fetch!');
        }
    }

    refresh() {
        this.setState({ refreshing: true });

        this.fetchActiveSessions()
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
                    <>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={this.localStyle.accordionTitle}>Actives Sessions</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={this.state.activeSessionsList}
                            onPress={() => {
                                this.setState({ activeSessionsList: !this.state.activeSessionsList });
                            }}
                        >
                            {!this.state.sessions ? (
                                <ListItem>
                                    <ListItem.Content>
                                        <ListItem.Title>No active sessions</ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            ) : (
                                this.state.sessions.map((session, index) => {
                                    return (
                                        <ListItem
                                            key={index + 1}
                                            bottomDivider
                                            onPress={() => {
                                                this.props.navigation.navigate('SingleSession', {
                                                    title: session.Session.id,
                                                    server: this.state.server,
                                                    session: session
                                                })
                                            }}
                                        >
                                            <Avatar
                                                rounded
                                                source={{uri: session.User.thumb}}
                                            />

                                            <ListItem.Content>
                                                <ListItem.Title>{sessionTitle(session)}</ListItem.Title>
                                                <ListItem.Subtitle>{session.Player.state}</ListItem.Subtitle>
                                                <ListItem.Subtitle>{session.Player.address}</ListItem.Subtitle>
                                                <ListItem.Subtitle>{session.Player.product}</ListItem.Subtitle>
                                                <ListItem.Subtitle>{session.Player.version}</ListItem.Subtitle>
                                            </ListItem.Content>

                                            <ListItem.Chevron color='black' />
                                        </ListItem>
                                    );
                                })
                            )}
                        </ListItem.Accordion>
                    </>
                </Card>
            </ScrollView>
        );
    }
}

export default (props) => {
    const navigation = useNavigation();
    return <ActiveSessions {...props} navigation={navigation} />;
};
