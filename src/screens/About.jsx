import React from 'react';
import { ScrollView, Linking, RefreshControl, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import info from '../../package.json';
import { Card, ListItem, Avatar } from '@rneui/themed';
import FastImage from 'react-native-fast-image';

export default class About extends React.Component {
    localStyle = StyleSheet.create({
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14
        }
    })

    constructor() {
        super();

        this.state = {
            refreshing: false,
            aboutList: true,
            authorsList: true,
            authors: []
        };

        this.refresh = this.refresh.bind(this);
    }

    async fetchAuthors() {
        try {
            let authors = await axios.get('https://api.github.com/repos/sikelio/plexmanager/contributors');

            this.setState({ authors: authors.data });
        } catch (e) {
            Alert.alert('Something went wrong during fetching the authors');
        }
    }

    async componentDidMount() {
        await this.fetchAuthors();
    }

    refresh() {
        this.setState({ refreshing: true });

        this.fetchAuthors()
            .finally(() => {
                this.setState({ refreshing: false });
            });
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={ this.state.refreshing } onRefresh={ this.refresh } />
                }
            >
                <Card>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={this.localStyle.accordionTitle}>About</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={ this.state.aboutList }
                        onPress={() => {
                            this.setState({ aboutList: !this.state.aboutList });
                        }}
                    >
                        <ListItem
                            onPress={() => {
                                Linking.openURL('https://github.com/sikelio/plexmanager/releases/tag/0.0.2-beta')
                            }}
                        >
                            <Avatar
                                ImageComponent={() => (
                                    <FastImage
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 25,
                                            position: 'absolute'
                                        }}
                                        source={ require('../assets/img/logo.png') }
                                        resizeMode={ FastImage.resizeMode.contain }
                                    />
                                )}
                                overlayContainerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />

                            <ListItem.Content>
                                <ListItem.Title>Version</ListItem.Title>
                                <ListItem.Subtitle>{ info.version }</ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron color='black' />
                        </ListItem>

                        <ListItem
                            onPress={() => {
                                Linking.openURL('https://github.com/sikelio/plexmanager')
                            }}
                        >
                            <Avatar
                                containerStylecontainerStyle={{ backgroundColor: '#E3E3E3' }}
                                rounded
                                ImageComponent={() => (
                                    <FastImage
                                        style={{
                                            width: 22.5,
                                            height: 22.5,
                                            borderRadius: 25,
                                            position: 'absolute',
                                        }}
                                        source={ require('../assets/icons/github.png') }
                                        resizeMode={ FastImage.resizeMode.contain }
                                    />
                                )}
                                overlayContainerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />

                            <ListItem.Content>
                                <ListItem.Title>Source code</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron color='black' />
                        </ListItem>

                        <ListItem
                            onPress={() => {
                                Linking.openURL('https://choosealicense.com/licenses/gpl-3.0/')
                            }}
                        >
                            <Avatar
                                containerStyle={{ backgroundColor: '#E3E3E3' }}
                                rounded
                                ImageComponent={() => (
                                    <FastImage
                                        style={{
                                            width: 22.5,
                                            height: 22.5,
                                            borderRadius: 25,
                                            position: 'absolute',
                                        }}
                                        source={ require('../assets/icons/license.png') }
                                        resizeMode={ FastImage.resizeMode.contain }
                                    />
                                )}
                                overlayContainerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />

                            <ListItem.Content>
                                <ListItem.Title>GNU General Public License v3.0</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron color='black' />
                        </ListItem>
                    </ListItem.Accordion>
                </Card>

                <Card>
                    <ListItem.Accordion
                        content={
                            <ListItem.Content>
                                <ListItem.Title style={this.localStyle.accordionTitle}>Authors</ListItem.Title>
                            </ListItem.Content>
                        }
                        isExpanded={ this.state.authorsList }
                        onPress={() => {
                            this.setState({ authorsList: !this.state.authorsList });
                        }}
                    >
                        {this.state.authors.map((author, index) => {
                            return (
                                <ListItem
                                    key={ index }
                                    bottomDivider
                                    onPress={() => {
                                        Linking.openURL(author.html_url);
                                    }}
                                >
                                    <Avatar
                                        ImageComponent={() => (
                                            <FastImage
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 25,
                                                    position: 'absolute'
                                                }}
                                                source={{
                                                    uri: author.avatar_url,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                resizeMode={ FastImage.resizeMode.contain }
                                            />
                                        )}
                                        overlayContainerStyle={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />

                                    <ListItem.Content>
                                        <ListItem.Title>{ author.login }</ListItem.Title>
                                        <ListItem.Subtitle>{ author.type }</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron color='black' />
                                </ListItem>
                            );
                        })}
                    </ListItem.Accordion>
                </Card>
            </ScrollView>
        );
    }
}
