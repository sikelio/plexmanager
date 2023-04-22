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
                            <Text>Summary : { getPreferenceSummary(preference) }</Text>
                            <Text>Group : { getPreferenceGroupName(preference) }</Text>
                            <Text>Value : { getPreferenceValue(preference) }</Text>
                            <Text>Advanced : { preference.advanced.toString() }</Text>
                            <Text>Hidden : { preference.hidden.toString() }</Text>
                        </View>
                    </Card>
                );
            })}
        </ScrollView>
    );
}

export default ServerPreferences;
