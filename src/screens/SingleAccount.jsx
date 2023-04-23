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
                <View style={ [style.container] }>
                    <Text style={ [style.userPreferencesLabel] }>Auto select audio</Text>
                    <Text style={ [style.userPreferencesValue] }>{ userDetails.autoSelectAudio.toString() }</Text>

                    <Text style={ [style.userPreferencesLabel] }>Default audio language</Text>
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

                    <Text style={ [style.userPreferencesLabel] }>Default subtitle language</Text>
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

                    <Text style={ [style.userPreferencesLabel] }>Subtitle mode</Text>
                    <Text style={ [style.userPreferencesValue] }>{ userDetails.subtitleMode }</Text>
                </View>
            </Card>
        </ScrollView>
    );
}

export default SingleAccount;
