import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import { Button } from 'react-native-material-design';

export default class ChaoFanItem extends Component {
  render() {
    return (
      <View>
        <View style={styles.userInfo}>
          <Text>
            {this.props.order.userName}已排队{new Date(Date.now() - Number(this.props.order.startTime)).getUTCMinutes()}分钟 排到{Number(this.props.order.ordinal) + 1}位 预计还需{(Number(this.props.order.ordinal) + 1) * 3}分钟 {Number(this.props.order.price) > 0 ? `估计${this.props.order.price}元` : '' }
          </Text>
        </View>
        <View style={styles.ChaoFanItem}>
          {!this.props.isUser ? <Button text={'三'} raised={true} onPress={this.props.setOrder.bind(this, this.props.order)} /> : <Text></Text> }
          {this.props.order.mainPrinciples.map(item => <Text style={styles.ChaoFanItem_mainPrinciple} key={item.id}> {item.chineseName} </Text>)}
          {this.props.order.vicePrinciples.map(item => <Text style={styles.ChaoFanItem_vicePrinciple} key={item.id}> {item.chineseName} </Text>)}
        </View>
      </View>

    )
  }
}


var styles = StyleSheet.create({
  userInfo: {
    borderTopColor: '#BDBDBD',
    borderTopWidth: 4,
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 13
  },
  ChaoFanItem: {
    borderBottomColor: '#BDBDBD',
    borderBottomWidth: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    marginLeft: 5,
    marginRight: 5,
    padding: 5
  },
  ChaoFanItem_mainPrinciple: {
    fontSize: 25,
    padding: 3
  },
  ChaoFanItem_vicePrinciple: {
    fontSize: 25,
    padding: 3,
    marginRight: 3,
    backgroundColor: '#CCCCCC'
  }
});
