// Components
import {Dimensions, ScrollView, Text, View} from "react-native";
import { Card } from "@rneui/themed";
import FastImage from "react-native-fast-image";
// Styles
import style from "../style/SingleEpisodeStyle";
import React from "react";

const SingleEpisode = ({ route }) => {
    const { server, episode } = route.params;

    const mainImgWidth = Dimensions.get('window').width;
    const mainImgHeight = (Dimensions.get('window').width * 9 / 16);

    return (
        <ScrollView>
            <Card>
                <View>
                    <FastImage
                        style={{
                            width: mainImgWidth * 0.85,
                            height: mainImgHeight * 0.85
                        }}
                        source={{
                            uri: `${server.protocol}://${server.ip}:${server.port}${episode.thumb}?X-Plex-Token=${server.token}`,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={ FastImage.resizeMode.contain }
                    />
                </View>

                <Text style={ [style.textColor, style.textLabel] }>{ episode.title }</Text>
                <Card.Divider />

                <Text style={ [style.textColor] }>
                    <Text style={ [style.textLabel] }>Summary : </Text>
                    { episode.summary }
                </Text>

                <Text style={ [style.textColor] }>
                    <Text style={ [style.textLabel] }>Duration : </Text>
                    { episode.duration ? new Date(episode.duration).toISOString().slice(11, 19) : 'unknown' }
                </Text>
            </Card>
        </ScrollView>
    );
}

export default SingleEpisode;
