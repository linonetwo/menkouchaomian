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
  ScrollView
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
      user: true
    };
  }

  componentWillMount() {
    this._fetchQueue();
  }



  _fetchQueue = () => {
    fetch(`${API_ROOT}/queue`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          queue: responseData.queue
        });
        console.log(responseData.queue[0]);
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
          >

            {this.state.queue.map(item => <ChaoFanItem order={item} key={item.id}/> )}



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
