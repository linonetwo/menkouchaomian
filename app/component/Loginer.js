import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  View,
  Text
} from 'react-native';

import {
  MKTextField,
  MKColor,
  mdl,
} from 'react-native-material-kit';


const TextInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('输入你显示给炒饭大叔的用户名')
  .withTintColor(MKColor.Lime)
  .withTextInputStyle({color: MKColor.Indigo})
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
  })
  .build();

export default class Loginer extends Component {
  render() {
    return (
      <View style={styles.Loginer}>
        <TextInput />
      </View>
    )
  }
}


var styles = StyleSheet.create({
  Loginer: {
    justifyContent: 'space-between',
    padding: 10
  },
});
