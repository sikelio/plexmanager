// Components
import { ScrollView, Text, View } from "react-native";
import { Card, Button } from "@rneui/themed";
// Functions
import { sendRequest } from "../functions/ServerRequest";
// Styles
import style from "../style/LibraryManageStyle"

const LibraryManage = ({ route, navigation }) => {
    const { library, server } = route.params;

    return (
        <ScrollView>
            <Card>
                <Card.Title>Actions</Card.Title>
                <Card.Divider />
                <View style={ [style.container] }>
                    <Button
                        title='Scan'
                        containerStyle={{
                            width: '48%'
                        }}
                        buttonStyle={{
                            backgroundColor: '#e5a00d'
                        }}
                        onPress={() => {
                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/refresh?X-Plex-Token=${server.token}`);
                        }}
                    />

                    <Button
                        title='Metadata'
                        containerStyle={{
                            width: '48%'
                        }}
                        buttonStyle={{
                            backgroundColor: '#e5a00d'
                        }}
                        onPress={() => {
                            sendRequest(`${server.protocol}://${server.ip}:${server.port}/library/sections/${library.key}/refresh?force=1&X-Plex-Token=${server.token}`);
                        }}
                    />
                </View>
            </Card>
        </ScrollView>
    );
}

export default LibraryManage
