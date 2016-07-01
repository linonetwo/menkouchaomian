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
    const waitingTime = Date.now() - Number(this.props.order.startTime);
    return (
      <View>
        <View style={styles.userInfo}>
          <Text>
            {this.props.order.userName}已排队{new Date(waitingTime).getUTCHours() * 60 + new Date(waitingTime).getUTCMinutes()}分钟 排到{Number(this.props.order.ordinal) + 1}位 预计还需{(Number(this.props.order.ordinal) + 1) * 3}分钟 {Number(this.props.order.price) > 0 ? `估计${this.props.order.price}元` : '' }
          </Text>
        </View>
        <View style={styles.ChaoFanItem}>
          {!this.props.isUser ? <Button text={'三'} raised={true} onPress={this.props.setOrder.bind(this, this.props.order)} /> : <Text></Text> }
          {this.props.order.mainPrinciples.map(item => <Text style={styles.ChaoFanItem_mainPrinciple} key={item.id}> {item.chineseName} </Text>)}
          {this.props.order.vicePrinciples.map(item => <Text style={styles.ChaoFanItem_vicePrinciple} key={item.id}> {item.chineseName} </Text>)}
          {this.props.order.finished ? <Text style={styles.ChaoFanItem_finished}>{this.props.isUser ? '炒完了下来拿' : '等待支付'}</Text> : <Text></Text>}
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
    padding: 5,
  },
  ChaoFanItem_mainPrinciple: {
    fontSize: 25,
    padding: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  ChaoFanItem_vicePrinciple: {
    fontSize: 25,
    padding: 3,
    marginRight: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#CCCCCC'
  },
  ChaoFanItem_finished: {
    fontSize: 25,
    padding: 3,
    marginRight: 3,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#8BC34A'
  }
});
