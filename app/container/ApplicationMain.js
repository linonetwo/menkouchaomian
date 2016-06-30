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
      user: undefined,
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

  _dependUser = (e) => {
    const text = e.nativeEvent.text;
    if (text == 'aaa@aaa') {
      this.setState({
        user: false
      })
    }
    console.log(text);
  }

  render() {

    return (
      <View style={styles.container}>
        {/*在未获得登录信息的时候显示登录框*/}
        {this.state.user == undefined ? <Loginer handleInput={this._dependUser}/> : <Text></Text> }
        <ScrollView
          contentContainerStyle={styles.listView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._fetchQueue}
              enable={true}
            />}
          >

            {/*如果是 user 就不让他们看到整个列表，只让炒面大叔看到*/}
            {this.state.user == false ?  this.state.queue.map(item => <ChaoFanItem order={item} key={item.id}/> ) : <Text></Text> }



        </ScrollView>
        {this.state.user !== undefined ? <Adder /> : <Text>@linonetwo createdBy♥andHunger Using ReactNative </Text> }
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
