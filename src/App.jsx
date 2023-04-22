// Dependencies
import React from 'react';
// Components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Tabs from './components/Tabs';
// Screens
import ServerManage from "./screens/ServerManage";
import EditServer from "./screens/EditServer";
import SessionManage from "./screens/SessionManage";
import SingleAccount from "./screens/SingleAccount";
import ServerPreferences from "./screens/ServerPreferences";
import LibraryManage from "./screens/LibraryManage";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen
                  name='Server'
                  component={ Tabs }
                  options={{ headerShown: false }}
              />
              <Stack.Screen
                  name="ServerManage"
                  component={ ServerManage }
                  options={({ route }) => ({ title: route.params.title })}
              />
              <Stack.Screen
                  name="EditServer"
                  component={ EditServer }
                  options={({ route }) => ({ title: `Edit ${route.params.title}` })}
              />
              <Stack.Screen
                  name="SessionManage"
                  component={ SessionManage }
                  options={({ route }) => ({ title: `Manage session - ${route.params.title}` })}
              />
              <Stack.Screen
                  name="SingleAccount"
                  component={ SingleAccount }
                  options={({ route }) => ({ title: `User : ${route.params.title}` })}
              />
              <Stack.Screen
                  name="ServerPreferences"
                  component={ ServerPreferences }
                  options={({ route }) => ({ title: `Server Preferences` })}
              />
              <Stack.Screen
                  name="LibraryManage"
                  component={ LibraryManage }
                  options={({ route }) => ({ title: `Library : ${route.params.title}` })}
              />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;
