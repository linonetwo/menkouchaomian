

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import { Button, Card } from 'react-native-material-design';


export default class Adder extends Component {
  render() {
    return (
      <View style={styles.adder}>
        <View
          style={{height: 300}}>
          <View style={styles.publisherButtons}>
              <Button text="新料" primary={'paperGrey'} /> 
              {/*primary = ["googleBlue","googleGreen","googleGrey","googleRed","googleYellow","paperAmber","paperBlue","paperBlueGrey","paperBrown","paperCyan","paperDeepOrange","paperDeepPurple","paperGreen","paperGrey","paperIndigo","paperLightBlue","paperLightGreen","paperLime","paperOrange","paperPink","paperPurple","paperRed","paperTeal","paperYellow"]*/}
              <Button text="提交" primary={'googleGreen'}/>
          </View>
          <ScrollView contentContainerStyle={styles.principles} >
            <View style={styles.principles_main}>
              <Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="加料" /><Button text="final" />
            </View>
            <View style={styles.principles_vice}>
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" />
              <Button text="OK" /><Button text="加料" /><Button text="OK" /><Button text="加料" />
              <Button text="final" />
            </View>
          </ScrollView>

        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  adder: {
    margin: 8,
    height: 300,
    backgroundColor: '#EEEEEE'
  },
  publisherButtons: {
    height: 45,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  principles: {
    paddingTop: 15,
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  principles_main: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  principles_vice: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#CCCCCC'
  }
});
