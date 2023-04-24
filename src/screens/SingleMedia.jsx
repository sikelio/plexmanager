// Components
import { Dimensions, ScrollView, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import FastImage from "react-native-fast-image";
// Functions
import { getDateFromTimestamp, getTimeFromTimestamp } from "../functions/GlobalUtiles";
// Styles
import style from "../style/SingleMediaStyle";

const SingleMedia = ({ route }) => {
    const { media, server } = route.params;

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
                            uri: `${server.protocol}://${server.ip}:${server.port}${media.art}?X-Plex-Token=${server.token}`,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={ FastImage.resizeMode.contain }
                    />

                    <Text style={ [style.textColor, style.textLabel] }>{ media.title } { media.studio ? `- ${media.studio}` : '' }</Text>
                    <Card.Divider />

                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Summary : </Text>
                        { media.summary }
                    </Text>

                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Duration : </Text>
                        { media.duration ? new Date(media.duration).toISOString().slice(11, 19) : 'unknown'  }
                    </Text>

                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Rating : </Text>
                        { media.rating ? media.rating : 'unknown' }
                    </Text>

                    <Text style={ [style.textColor] }>
                        <Text style={ [style.textLabel] }>Added at : </Text>
                        { getDateFromTimestamp(media.addedAt) } - { getTimeFromTimestamp(media.addedAt) }
                    </Text>
                </View>
            </Card>
        </ScrollView>
    );
}

export default SingleMedia;
