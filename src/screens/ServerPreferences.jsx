// Components
import { Text, ScrollView, View } from "react-native";
import { Card } from "@rneui/themed";
// Functions
import {
    getPreferenceGroupName,
    getPreferenceLabel,
    getPreferenceSummary,
    getPreferenceValue
} from "../functions/ServerManageUtiles";
// Styles
import style from "../style/ServerPreferencesStyle";

const ServerPreferences = ({ route, navigation }) => {
    const { preferences } = route.params;

    return (
        <ScrollView>
            {preferences.map((preference, index) => {
                return (
                    <Card key={ index }>
                        <Card.Title>{ getPreferenceLabel(preference) }</Card.Title>
                        <Card.Divider />
                        <View>
                            <Text
                                style={ [style.cardBodyText] }
                            >
                                Summary : { getPreferenceSummary(preference) }
                            </Text>
                            <Text
                                style={ [style.cardBodyText] }
                            >
                                Group : { getPreferenceGroupName(preference) }
                            </Text>
                            <Text
                                style={ [style.cardBodyText] }
                            >
                                Value : { getPreferenceValue(preference) }
                            </Text>
                            <Text
                                style={ [style.cardBodyText] }
                            >
                                Advanced : { preference.advanced.toString() }
                            </Text>
                            <Text
                                style={ [style.cardBodyText] }
                            >
                                Hidden : { preference.hidden.toString() }
                            </Text>
                        </View>
                    </Card>
                );
            })}
        </ScrollView>
    );
}

export default ServerPreferences;
