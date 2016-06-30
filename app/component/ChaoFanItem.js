import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class ChaoFanItem extends Component {
  render() {
    return (
      <View style={styles.ChaoFanItem}>
          {this.props.order.mainPrinciples.map(item => <Text style={styles.ChaoFanItem_mainPrinciple} key={item.id}> {item.chineseName} </Text>)}
          {this.props.order.vicePrinciples.map(item => <Text style={styles.ChaoFanItem_vicePrinciple} key={item.id}> {item.chineseName} </Text>)}
      </View>
    )
  }
}


var styles = StyleSheet.create({
  ChaoFanItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    backgroundColor: '#66CCFF',
    margin: 5,
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
