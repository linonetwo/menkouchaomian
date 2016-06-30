/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import config from '../../config';


import ChaoFanItem from '../component/ChaoFanItem';
import Adder from '../component/Adder';
import Loginer from '../component/Loginer';



const API_ROOT = `${config.graphQLHost}:${config.graphQLPort}`;






export default class ApplicationMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
      user: true,
      loaded: false,
      isRefreshing: false
    };
  }

  componentWillMount() {
    this._fetchQueue();
  }



  _fetchQueue = () => {
    this.setState({isRefreshing: true});
    fetch(`${API_ROOT}/queue`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          queue: responseData.queue,
          loaded: true,
          isRefreshing: false
        });
      })
      .catch((err) => {console.log(err);})
      .done();
  }


  render() {

    return (
      <View style={styles.container}>
        <Loginer />
        <ScrollView
          contentContainerStyle={styles.listView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._fetchQueue}
              enable={true}
            />}
          >




        </ScrollView>
        <Adder />
      </View>
    );
  }

};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',

  },
  listView: {
    paddingTop: 10,
  }
});
