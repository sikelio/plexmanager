// Dependencies
import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import info from "../../package.json";
// Components
import { ScrollView, Linking, RefreshControl } from "react-native";
import { Card, ListItem, Avatar } from "@rneui/themed";
import FastImage from "react-native-fast-image";
// Functions
import { fetchAuthors } from "../functions/AboutUtiles";
// Styles
import style from "../style/AboutStyle";



const About = () => {
    const [ aboutList, setAboutList ] = useState(true);
    const [ authorsList, setAuthorsList ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false);
    const [ authors, setAuthors ] = useState([]);

    const updateData = async () => {
        try {
            const [
                updatedAuthors
            ] = await Promise.all([
                axios.get('https://api.github.com/repos/sikelio/plexmanager/contributors')
            ]);

            setAuthors(updatedAuthors.data);
        } catch (e) {}
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        updateData().finally(() => {
            setRefreshing(false);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAuthors(setAuthors);
        }, [])
    );

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
            }
        >
            <Card>
                <ListItem.Accordion
                    content={
                        <ListItem.Content>
                            <ListItem.Title style={ [style.accordionTitle] }>About</ListItem.Title>
                        </ListItem.Content>
                    }
                    isExpanded={ aboutList }
                    onPress={() => {
                        setAboutList(!aboutList)
                    }}
                >
                    <ListItem
                        onPress={() => {
                            Linking.openURL('https://github.com/sikelio/plexmanager')
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
                            <ListItem.Title style={ [style.accordionTitle] }>Authors</ListItem.Title>
                        </ListItem.Content>
                    }
                    isExpanded={ authorsList }
                    onPress={() => {
                        setAuthorsList(!authorsList)
                    }}
                >
                    {authors.map((author, index) => {
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

export default About;
