// Components
import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { Card } from "@rneui/themed";
import { getDateFromTimestamp, getTimeFromTimestamp } from "../functions/GlobalUtiles";
// Styles
import style from "../style/SingleMediaStyle";

const SingleMedia = ({ route }) => {
    const { media, server } = route.params;

    const mainImgWidth = Dimensions.get('window').width;
    const mainImgHeight = (Dimensions.get('window').width * 9 / 16);

    return (
        <ScrollView>
            <View style={{ flex: 1 }}>
                <Card>
                    <View>
                        <Image
                            style={{
                                width: mainImgWidth * 0.85,
                                height: mainImgHeight * 0.85
                            }}
                            source={{
                                uri: `${server.protocol}://${server.ip}:${server.port}${media.art}?X-Plex-Token=${server.token}`,
                                cache: 'only-if-cached',
                            }}
                        />
                        <Text style={ [style.textColor, style.textLabel] }>{ media.title } - { media.studio }</Text>
                        <Card.Divider />

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Summary : </Text>
                            { media.summary }
                        </Text>

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Duration : </Text>
                            { new Date(media.duration).toISOString().slice(11, 19) }
                        </Text>

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Rating : </Text>
                            { media.rating }
                        </Text>

                        <Text style={ [style.textColor] }>
                            <Text style={ [style.textLabel] }>Added at : </Text>
                            { getDateFromTimestamp(media.addedAt) } - { getTimeFromTimestamp(media.addedAt) }
                        </Text>
                    </View>
                </Card>
            </View>
        </ScrollView>
    );
}

export default SingleMedia;
