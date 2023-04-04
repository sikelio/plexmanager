// Dependencies
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// Components
import Tabs from './src/components/Tabs';

const App = (): JSX.Element => {
  return (
    <NavigationContainer>
        <Tabs></Tabs>
    </NavigationContainer>
  );
}

export default App;
