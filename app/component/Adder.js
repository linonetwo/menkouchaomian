

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

import { Button } from 'react-native-material-design';


export default class Adder extends Component {

  render() {
    return (
      <View style={styles.adder}>
        <View
          style={{height: 300}}>
          <View style={styles.publisherButtons}>
              <Button text="此处无欲加之料" primary={'paperGrey'} onPress={this.props.addNewKindsOfPrinciples}/>
              {/*primary = ["googleBlue","googleGreen","googleGrey","googleRed","googleYellow","paperAmber","paperBlue","paperBlueGrey","paperBrown","paperCyan","paperDeepOrange","paperDeepPurple","paperGreen","paperGrey","paperIndigo","paperLightBlue","paperLightGreen","paperLime","paperOrange","paperPink","paperPurple","paperRed","paperTeal","paperYellow"]*/}
              <Button text="提交" primary={'googleGreen'} onPress={this.props.submitPrinciples}/>
          </View>
          <ScrollView contentContainerStyle={styles.principles} >
            <View style={styles.principles_main}>
              {this.props.principles.mainPrinciples.map(item => <Button text={item.chineseName} key={item.id} raised={this.props.principlesAdded.filter(usedItem => usedItem.id == item.id).length == 1} onPress={this.props.addPrinciple.bind(this, item)}/>)}
            </View>
            <View style={styles.principles_vice}>
              {this.props.principles.vicePrinciples.map(item => <Button text={item.chineseName} key={item.id} raised={this.props.principlesAdded.filter(usedItem => usedItem.id == item.id).length == 1} onPress={this.props.addPrinciple.bind(this, item)}/>)}
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
