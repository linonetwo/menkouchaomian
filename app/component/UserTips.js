import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class UserTips extends Component {
  render() {
    return (
      <View style={styles.loginedTip}>
        <Text style={styles.loginedTip_text}>使用用户名 {this.props.userName} 排队中</Text>
        <Text style={styles.loginedTip_text}>订单提交后可别改名，不然大叔会白做一份</Text>
        <Text style={styles.loginedTip_text}>大叔{this.props.canCook?'已':'未'}出摊</Text>
      </View>
    )
  }
}


var styles = StyleSheet.create({
  loginedTip: {
    flexDirection: 'column',
  },
  loginedTip_text: {
    fontSize: 15,
    backgroundColor: '#EEEEEE',
    textAlign: 'center'
  }
});
