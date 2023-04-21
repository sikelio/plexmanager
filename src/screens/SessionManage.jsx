import { View } from "react-native";
import { Button } from "@rneui/themed";
import style from "../style/SessionManageStyle";
import { sendRequest } from "../functions/ServerRequest";

const SessionManage = ({ route, navigation }) => {
    const { server, session } = route.params;
    const reason = "RTFM";

    return (
        <View
            style={ [style.mainContainer] }
        >
        </View>
    );
}

export default SessionManage;
