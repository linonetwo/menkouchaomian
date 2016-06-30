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
import UserQueue from '../component/UserQueue';



const API_ROOT = `${config.graphQLHost}:${config.graphQLPort}`;






export default class ApplicationMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
      principles: {
        mainPrinciples: [],
        vicePrinciples: []
      },
      user: undefined,
      principlesAdded: [],
      loaded: false,
      isRefreshing: false
    };
  }

  componentWillMount() {
    this._fetchQueue();
  }



  _fetchQueue = () => {
    this.setState({isRefreshing: true});
    fetch(`${API_ROOT}/all`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          queue: responseData.queue,
          principles: responseData.principles,
          loaded: true,
          isRefreshing: false
        });
      })
      .catch((err) => {console.log(err);})
      .done();
  }


  _dependUser = (e) => {
    const userName = e.nativeEvent.text;
    if (userName == 'aaa@aaa') {
      this.setState({
        user: false
      })
      return null;
    }


    this.setState({
      user: true,
      userName: userName
    })
    fetch(`${API_ROOT}/login`, {
      'method': 'POST',
      headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
      'mode': 'cors',
      'body': `userName=${userName}`
    })
      .then((response) => response.json())
      .then((responseData) => {
        const {userInfo: {id: userUUID}} = responseData;
        this.setState({userUUID}); // 往状态里添加了 uuid 之后，如果这个 uuid 已有订单，下面的 .filter 就会把已有的订单显示出来
      })
      .catch((err) => console.log(err))
      .done();
  }

  _handleAddPrinciple = (item) => {
    let indexOfRedundentItem = -1;
    const alreadyHasThisItem = this.state.principlesAdded.filter((usedItem, index) => {indexOfRedundentItem = index; return usedItem.id == item.id;}).length == 1; // filter 出来的数组长度为 1 就说明已经存在此元素，同时我们还存下了这个元素的 index
    console.log(alreadyHasThisItem, item, indexOfRedundentItem, this.state.principlesAdded);
    this.setState({principlesAdded: alreadyHasThisItem ? this.state.principlesAdded.filter(usedItem => usedItem.id !== item.id) : this.state.principlesAdded.concat(item)});
  }

  _handleAddNewKindsOfPrinciples = () => {

  }

  _handleSubmit = () => {
    if (this.state.principlesAdded.length == 0) {
      return null;
    }
    fetch(`${API_ROOT}/submitPrinciples`, {
      'method': 'POST',
      headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
      'mode': 'cors',
      'body': `principlesAdded=${JSON.stringify(this.state.principlesAdded)}&userUUID=${this.state.userUUID}`
    })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({principlesAdded: [], userUUID: this.state.userUUID});
        return this._fetchQueue();
      })
      .catch((err) => console.log(err))
      .done();
  }

  render() {

    return (
      <View style={styles.container}>
        {/*在未获得登录信息的时候显示登录框*/}
        { this.state.user == undefined ? <Loginer handleInput={this._dependUser}/> : <Text></Text> }
        { this.state.user == true ? <UserQueue userName={this.state.userName}/> : <Text></Text> }
        <ScrollView
          contentContainerStyle={styles.listView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._fetchQueue}
              enable={true}
            />}
          >

            {/*如果是 user 就不让他们看到整个列表，只让炒面大叔看到，当用户登陆后，过滤一下只显示这个用户提交过的活跃的订单*/}
            { this.state.user == false ? this.state.queue.map(item => <ChaoFanItem order={item} key={item.id}/> ) : this.state.queue.filter(item => item.userUUID == this.state.userUUID, this).map(item => <ChaoFanItem order={item} key={item.id}/> ) }



        </ScrollView>
        {
          this.state.user !== undefined
          ?
          <Adder principles={this.state.principles} principlesAdded={this.state.principlesAdded} addPrinciple={this._handleAddPrinciple} addNewKindsOfPrinciples={this._handleAddNewKindsOfPrinciples} submitPrinciples={this._handleSubmit}/>
          :
          <Text>@linonetwo createdBy♥andHunger Using ReactNative </Text>
        }
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
