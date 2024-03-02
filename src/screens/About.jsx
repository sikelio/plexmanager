import React from 'react';
import { ScrollView, Linking, RefreshControl, Alert, StyleSheet, View, Text } from 'react-native';
import axios from 'axios';
import info from '../../package.json';
import { Card, ListItem, Avatar } from '@rneui/themed';
import FastImage from 'react-native-fast-image';
import Colors from '../utiles/Colors';
import { addEventListener } from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome5';
import packageInfo from '../../package.json';

export default class About extends React.Component {
    localStyle = StyleSheet.create({
        accordionTitle: {
            fontWeight: 'bold',
            fontSize: 14,
            color: Colors.PlexYellow
        }
    });

    constructor() {
        super();

        this.state = {
            refreshing: false,
            authorsList: true,
            authors: [],
            connected: false,
            dependenciesList: true
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
        addEventListener(state => {
            this.setState({ connected: state.isConnected });
        });

        await this.fetchAuthors();
    }

    refresh() {
        this.setState({ refreshing: true });

        if (this.state.connected === true) {
            this.fetchAuthors()
                .finally(() => {
                    this.setState({ refreshing: false });
                });
        } else {
            this.setState({ refreshing: false });
        }
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />
                }
                style={{
                    backgroundColor: Colors.PlexGrey
                }}
            >
                <Card
                    containerStyle={{
                        backgroundColor: Colors.PlexBlack,
                        borderColor: Colors.PlexYellow,
                        borderWidth: 1
                    }}
                >
                    <View>
                        <ListItem
                            onPress={() => {
                                Linking.openURL('https://github.com/sikelio/plexmanager/releases/tag/0.0.2-beta')
                            }}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack
                            }}
                        >
                            <Avatar
                                containerStyle={{ backgroundColor: Colors.PlexGrey }}
                                rounded
                                ImageComponent={() => (
                                    <FastImage
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 25,
                                            position: 'absolute'
                                        }}
                                        source={ require('../assets/img/logo.png') }
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                )}
                                overlayContainerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />

                            <ListItem.Content>
                                <ListItem.Title
                                    style={{
                                        color: Colors.White
                                    }}
                                >
                                    Version
                                </ListItem.Title>
                                <ListItem.Subtitle
                                    style={{
                                        color: Colors.White
                                    }}
                                >
                                    {info.version}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                            <ListItem.Chevron color={Colors.White} />
                        </ListItem>

                        <ListItem
                            onPress={() => {
                                Linking.openURL('https://github.com/sikelio/plexmanager')
                            }}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack
                            }}
                        >
                            <Avatar
                                containerStyle={{ backgroundColor: Colors.PlexGrey }}
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
                                <ListItem.Title
                                    style={{
                                        color: Colors.White
                                    }}
                                >
                                    Source code
                                </ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron color={Colors.White} />
                        </ListItem>

                        <ListItem
                            onPress={() => {
                                Linking.openURL('https://choosealicense.com/licenses/gpl-3.0/')
                            }}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack
                            }}
                        >
                            <Avatar
                                containerStyle={{ backgroundColor: Colors.PlexGrey }}
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
                                <ListItem.Title
                                    style={{
                                        color: Colors.White
                                    }}
                                >
                                    GNU General Public License v3.0
                                </ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron color={Colors.White} />
                        </ListItem>
                    </View>
                </Card>

                <Card
                    containerStyle={{
                        backgroundColor: Colors.PlexBlack,
                        borderColor: Colors.PlexYellow,
                        borderWidth: 1
                    }}
                >
                    <View>
                        {this.state.connected === true ? (
                            this.state.authors.map((author, index) => {
                                return (
                                    <ListItem
                                        key={ index }
                                        onPress={() => {
                                            Linking.openURL(author.html_url);
                                        }}
                                        containerStyle={{
                                            backgroundColor: Colors.PlexBlack
                                        }}
                                    >
                                        <Avatar
                                            containerStyle={{ backgroundColor: Colors.PlexGrey }}
                                            rounded
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
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                            )}
                                            overlayContainerStyle={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        />

                                        <ListItem.Content>
                                            <ListItem.Title
                                                style={{
                                                    color: Colors.White
                                                }}
                                            >
                                                {author.login}
                                            </ListItem.Title>
                                            <ListItem.Subtitle
                                                style={{
                                                    color: Colors.White
                                                }}
                                            >
                                                {author.type}
                                            </ListItem.Subtitle>
                                        </ListItem.Content>

                                        <ListItem.Chevron color={Colors.White} />
                                    </ListItem>
                                ); 
                            })
                        ) : (
                            <View>
                                <ListItem
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            Not connected to internet
                                        </ListItem.Title>
                                    </ListItem.Content>
                                </ListItem>
                            </View>
                        )}
                    </View>
                </Card>

                <Card
                    containerStyle={{
                        backgroundColor: Colors.PlexBlack,
                        borderColor: Colors.PlexYellow,
                        borderWidth: 1
                    }}
                >
                    <View>
                        <ListItem.Accordion
                            content={
                                <ListItem.Content>
                                    <ListItem.Title style={this.localStyle.accordionTitle}>Used dependencies</ListItem.Title>
                                </ListItem.Content>
                            }
                            isExpanded={this.state.dependenciesList}
                            onPress={() => {
                                this.setState({ dependenciesList: !this.state.dependenciesList });
                            }}
                            containerStyle={{
                                backgroundColor: Colors.PlexBlack
                            }}
                            icon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                            expandIcon={<Icon name={'chevron-down'} type={'material-community'} color={Colors.PlexYellow} />}
                        >
                            {Object.entries(packageInfo.dependencies).map((dependencies, index) => (
                                <ListItem
                                    key={index}
                                    onPress={() => {
                                        Linking.openURL(`https://www.npmjs.com/package/${dependencies[0]}`);
                                    }}
                                    containerStyle={{
                                        backgroundColor: Colors.PlexBlack
                                    }}
                                >
                                    <Avatar
                                        containerStyle={{ backgroundColor: Colors.PlexGrey }}
                                        rounded
                                        ImageComponent={() => (
                                            <FastImage
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 25,
                                                    position: 'absolute'
                                                }}
                                                source={ require('../assets/icons/npm.png') }
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        )}
                                        overlayContainerStyle={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />

                                    <ListItem.Content>
                                        <ListItem.Title
                                            style={{
                                                color: Colors.White
                                            }}
                                        >
                                            {dependencies[0]}
                                        </ListItem.Title>
                                        <ListItem.Subtitle
                                                style={{
                                                    color: Colors.White
                                                }}
                                            >
                                                {dependencies[1].replaceAll('^', '')}
                                            </ListItem.Subtitle>
                                    </ListItem.Content>

                                    <ListItem.Chevron color={Colors.White} />
                                </ListItem>
                            ))}
                        </ListItem.Accordion>
                    </View>
                </Card>
            </ScrollView>
        );
    }
}
