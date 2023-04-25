// Components
import { Text, ScrollView, View } from "react-native";
import { Card } from "@rneui/themed";
// Style
import style from "../style/ScheduledTasksStyle";
const ScheduledTasks = ({ route }) => {
    const { scheduledTasks } = route.params;

    return (
        <ScrollView>
            {scheduledTasks.map((task, index) => {
                return (
                    <Card
                        key={ index }
                    >
                        <Card.Title>{ task.name }</Card.Title>
                        <Card.Divider />
                        <View>
                            <Text style={ [style.textColor] }>
                                <Text style={ [style.textLabel] }>Description : </Text>
                                { task.description }
                            </Text>
                            <Text style={ [style.textColor] }>
                                <Text style={ [style.textLabel] }>Schedule randomized : </Text>
                                { task.scheduleRandomized.toString() }
                            </Text>
                            <Text style={ [style.textColor] }>
                                <Text style={ [style.textLabel] }>Interval : </Text>
                                { task.interval }
                            </Text>
                        </View>
                    </Card>
                );
            })}
        </ScrollView>
    );
}

export default ScheduledTasks;
