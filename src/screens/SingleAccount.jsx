// Dependencies
import React from "react";
// Components
import { ScrollView, Text, View } from "react-native";
import { Card } from '@rneui/themed';
import FastImage from "react-native-fast-image";
// Functions
import { getCountryFlag } from "../functions/SingleAccountUtilities";
// Styles
import style from "../style/SingleAccountStyle";

const SingleAccount = ({ route, navigation }) => {
    const { userDetails } = route.params;

    return (
        <ScrollView>
            <Card>
                <Card.Title>{ userDetails.name }</Card.Title>
                <Card.Divider />
                <View>
                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Auto select audio : </Text>
                        { userDetails.autoSelectAudio.toString() }
                    </Text>
                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Default audio language : </Text>
                        <FastImage
                            style={{
                                width: 16,
                                height: 12,
                                alignSelf: 'center'
                            }}
                            source={{
                                uri: getCountryFlag(userDetails.defaultAudioLanguage)
                            }}
                        />
                    </Text>
                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Default subtitle language : </Text>
                        <FastImage
                            style={{
                                width: 16,
                                height: 12,
                                alignSelf: 'center'
                            }}
                            source={{
                                uri: getCountryFlag(userDetails.defaultSubtitleLanguage)
                            }}
                        />
                    </Text>
                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Subtitle mode : </Text>
                        <Text>{ userDetails.subtitleMode }</Text>
                    </Text>
                </View>
            </Card>
        </ScrollView>
    );
}

export default SingleAccount;
