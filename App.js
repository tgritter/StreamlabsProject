import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MainStack } from './App/config/router.js';
import { Provider } from 'react-redux';
import store from './App/redux/store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainStack/> 
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
