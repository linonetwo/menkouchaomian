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
import UserTips from '../component/UserTips';

import Modal from 'react-native-simple-modal';
import { Button } from 'react-native-material-design';

const API_ROOT = `${config.graphQLHost}:${config.graphQLPort}`;


import {
  MKTextField,
  MKColor,
  MKSwitch,
  mdl,
} from 'react-native-material-kit';

const PrincipleInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('输入想加的料')
  .withTintColor(MKColor.Amber)
  .withHighlightColor(MKColor.Amber)
  .withTextInputStyle({color: MKColor.Amber})
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
    color: '#FFC107'
  })
  .build();


const PriceInput = MKTextField.textfieldWithFloatingLabel()
  .withPlaceholder('价格（知道就填）')
  .withTintColor(MKColor.Grey)
  .withHighlightColor(MKColor.Grey)
  .withTextInputStyle({color: MKColor.Grey})
  .withFloatingLabelFont({
    fontSize: 10,
    fontStyle: 'italic',
    fontWeight: '200',
    color: '#9E9E9E'
  })
  .withKeyboardType('numeric')
  .build();



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
      isRefreshing: false,
      isAddingNewKindsOfPrinciple: false,
      newKindsOfPrinciple: '',
      newKindsOfPrinciplePrice: '',
      newKindsOfPrincipleIsMainPrinciple: false,
      isSettingOrder: false,
      orderToBeSet: {},
      isSetting: false,
      canCook: false,
      principlesUsedUp: []
    };
  }

  componentWillMount() {
    this._fetchAll();
  }



  _fetchAll = () => {
    this.setState({isRefreshing: true});
    fetch(`${API_ROOT}/all`)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          queue: responseData.queue,
          principles: responseData.principles,
          principlesUsedUp: responseData.principles.mainPrinciples.filter((item) => item.usedUp).concat(responseData.principles.vicePrinciples.filter((item) => item.usedUp)),
          loaded: true,
          isRefreshing: false,
          canCook: responseData.cookData.shopOpen
        });
      })
      .catch((err) => {console.log(err);})
      .done();
  }


  _dependUser = (e) => {
    const userName = e.nativeEvent.text;
    if (userName == 'a') {
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
    this.setState({isAddingNewKindsOfPrinciple: true});
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
      return this._fetchAll();
    })
    .catch((err) => console.log(err))
    .done();
  }

  _handleSubmitNewKindOfPrinciple = () => {
    const newPrinciple = this.state.newKindsOfPrinciple;
    const newPrinciplePrice = this.state.newKindsOfPrinciplePrice;
    const isMainPrinciple = this.state.newKindsOfPrincipleIsMainPrinciple;

    this.setState({isAddingNewKindsOfPrinciple: false});
    if (newPrinciple !== '') {
      console.log(isMainPrinciple);
      fetch(`${API_ROOT}/submitNewKindOfPrinciple`, {
        'method': 'POST',
        headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
        'mode': 'cors',
        'body': `newKindOfPrincipleAdded=${newPrinciple}&price=${Number(newPrinciplePrice)}&isMainPrinciple=${isMainPrinciple}`
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({newKindsOfPrinciple: '', newKindsOfPrinciplePrice: '', newKindsOfPrincipleIsMainPrinciple: false});
        return this._fetchAll();
      })
      .catch((err) => console.log(err))
      .done();
    }
  }


  _handleSetOrder = (order) => {
    this.setState({isSettingOrder: true, orderToBeSet: order});
  }

  _handleCookFinished = () => {
    this.setState({isSettingOrder: false});
    fetch(`${API_ROOT}/orderFinished`, {
      'method': 'POST',
      headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
      'mode': 'cors',
      'body': `orderUUID=${this.state.orderToBeSet.id}`
    })
    .then((response) => {
      return this._fetchAll();
    })
    .catch((err) => console.log(err))
    .done();
  }

  _handleCookPaid = () => {
    this.setState({isSettingOrder: false});
    fetch(`${API_ROOT}/orderPaid`, {
      'method': 'POST',
      headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
      'mode': 'cors',
      'body': `orderUUID=${this.state.orderToBeSet.id}`
    })
    .then((response) => {
      return this._fetchAll();
    })
    .catch((err) => console.log(err))
    .done();
  }

  _handleCookCanceled = () => {
    this.setState({isSettingOrder: false});
    fetch(`${API_ROOT}/orderCanceled`, {
      'method': 'POST',
      headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
      'mode': 'cors',
      'body': `orderUUID=${this.state.orderToBeSet.id}`
    })
    .then((response) => {
      return this._fetchAll();
    })
    .catch((err) => console.log(err))
    .done();
  }

  _handleChangeCanCook = () => {
    this.setState({canCook: !this.state.canCook});
    if (this.state.canCook) { // 本来开着，那就收摊
      fetch(`${API_ROOT}/closeShop`, {
        'method': 'POST',
        headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
        'mode': 'cors',
        'body': `canCook=${!this.state.canCook}`
      })
      .then((response) => {
        return this._fetchAll();
      })
      .catch((err) => console.log(err))
      .done();
    } else {
      fetch(`${API_ROOT}/openShop`, {
        'method': 'POST',
        headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
        'mode': 'cors',
        'body': `canCook=${!this.state.canCook}`
      })
      .then((response) => {
        return this._fetchAll();
      })
      .catch((err) => console.log(err))
      .done();
    }

  }

  _handleUsedUpPrinciple = (item) => {
    let indexOfRedundentItem = -1;
    const alreadyHasThisItem = this.state.principlesUsedUp.filter((usedItem, index) => {indexOfRedundentItem = index; return usedItem.id == item.id;}).length == 1; // filter 出来的数组长度为 1 就说明已经存在此元素，同时我们还存下了这个元素的 index
    if (alreadyHasThisItem) { // 此时要从 principlesUsedUp 中删掉这个元素，并在数据库中恢复这个食材的可用性
      this.setState({principlesUsedUp: this.state.principlesUsedUp.filter(usedItem => usedItem.id !== item.id)});
      fetch(`${API_ROOT}/principlesRewind`, {
        'method': 'POST',
        headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
        'mode': 'cors',
        'body': `principleUUID=${item.id}`
      })
      .then((response) => {
        return this._fetchAll();
      })
      .catch((err) => console.log(err))
      .done();

    } else { // 此时则是往 principlesUsedUp 中加入这个元素，并向服务器说这个食材用光了
      this.setState({principlesUsedUp: this.state.principlesUsedUp.concat(item)});
      fetch(`${API_ROOT}/principlesUsedUp`, {
        'method': 'POST',
        headers: new Headers({'Content-type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}),
        'mode': 'cors',
        'body': `principleUUID=${item.id}`
      })
      .then((response) => {
        return this._fetchAll();
      })
      .catch((err) => console.log(err))
      .done();
    }
  }

  render() {

    return (
      <View style={styles.container}>
        {/*在未获得登录信息的时候显示登录框*/}
        { this.state.user == undefined ? <Loginer handleInput={this._dependUser}/> : <Text></Text> }
        {/*在未添加菜的时候显示给用户的提示*/}
        { this.state.user == true && this.state.queue.filter(item => item.userUUID == this.state.userUUID, this).length == 0 ? <UserTips userName={this.state.userName} canCook={this.state.canCook}/> : <Text></Text> }
        {/*给炒面大叔显示一个控制台*/}
        {
          this.state.user == false
          ?
          <View style={styles.setting}>
            <Button
              text={this.state.canCook?'当前状态:已出摊':'当前状态:收摊'}
              raised={true}
              onPress={this._handleChangeCanCook}
              />
            <Button
              text={'有料卖光了'}
              raised={true}
              onPress={() => this.setState({isSetting: true})}
              />
          </View>
          :
          <Text></Text>
      }

        <ScrollView
          contentContainerStyle={styles.listView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._fetchAll}
              enable={true}
            />}
          >

            {/*如果是 user 就不让他们看到整个列表，只让炒面大叔看到，当用户登陆后，过滤一下只显示这个用户提交过的活跃的订单*/}
            {
              this.state.user == false
              ?
              this.state.queue.map(item => <ChaoFanItem order={item} key={item.id} isUser={this.state.user} setOrder={this._handleSetOrder}/> )
              :
              this.state.queue
                .filter(item => item.userUUID == this.state.userUUID, this)
                .map(item => <ChaoFanItem order={item} key={item.id} isUser={this.state.user}/> )
            }



        </ScrollView>
        {
          this.state.user !== undefined
          ?
          <Adder
            principles={this.state.principles}
            principlesAdded={this.state.principlesAdded}
            addPrinciple={this._handleAddPrinciple}
            addNewKindsOfPrinciples={this._handleAddNewKindsOfPrinciples}
            submitPrinciples={this._handleSubmit}
            />
          :
          <Text>@linonetwo createdBy♥andHunger Using ReactNative </Text>
        }
        <Modal
          open={this.state.isAddingNewKindsOfPrinciple}
          offset={0}
          overlayOpacity={0.75}
          animationDuration={200}
          animationTension={40}
          modalDidOpen={() => undefined}
          modalDidClose={() => this.setState({isAddingNewKindsOfPrinciple: false})}
          closeOnTouchOutside={true}
          style={styles.dialog}>
          <View style={styles.newKindsOfPrincipleTip}>
            <Text style={styles.newKindsOfPrincipleTip_text} >填写信息加入你想加的料</Text>
            <Text style={styles.newKindsOfPrincipleTip_text} >用光或没有的料加不了的</Text>
            <PrincipleInput onTextChange={text => this.setState({newKindsOfPrinciple: text})}/>
            <PriceInput onTextChange={text => this.setState({newKindsOfPrinciplePrice: text})}/>
            <View style={styles.isMainPrinciple}>
              <MKSwitch
                style={styles.isMainPrinciple_Switch}
                trackSize={30}
                trackLength={52}
                onColor="rgba(255,152,0,.3)"
                thumbOnColor={MKColor.Orange}
                rippleColor="rgba(255,152,0,.2)"
                onCheckedChange={(e) => this.setState({newKindsOfPrincipleIsMainPrinciple: e.checked})}
                />
              <Text style={styles.isMainPrinciple_Text} >这是主食</Text>
            </View>
            <View>
              <Button
                text={'提交'}
                raised={true}
                style={styles.addNewKindsOfPrinciples_Submit_Button}
                onPress={this._handleSubmitNewKindOfPrinciple.bind(this)}
                />
            </View>
          </View>
        </Modal>

        <Modal
          open={this.state.isSettingOrder}
          modalDidClose={() => this.setState({isSettingOrder: false})}
          offset={0}
          overlayOpacity={0.75}
          animationDuration={200}
          animationTension={40}
          closeOnTouchOutside={true}
          style={styles.dialog}>
          <View style={styles.setOrder}>
            <Button
              text={'炒完了'}
              raised={true}
              style={styles.setOrder_finished}
              onPress={this._handleCookFinished}
              />
            <Button
              text={'支付完了'}
              raised={true}
              style={styles.setOrder_paid}
              onPress={this._handleCookPaid}
              />
            <Button
              text={'取消这个订单'}
              raised={true}
              style={styles.setOrder_canceled}
              onPress={this._handleCookCanceled}
              />
          </View>
        </Modal>
        <Modal
          open={this.state.isSetting}
          modalDidClose={() => this.setState({isSetting: false})}
          offset={0}
          overlayOpacity={0.75}
          animationDuration={200}
          animationTension={40}
          closeOnTouchOutside={true}
          style={styles.dialog}>
          <View style={styles.setting}>
            {this.state.principles.mainPrinciples.map(item => <Button text={item.chineseName} raised={!(this.state.principlesUsedUp.filter(usedItem => usedItem.id == item.id).length == 1)} key={item.id} onPress={this._handleUsedUpPrinciple.bind(null, item)}/>)}
            {this.state.principles.vicePrinciples.map(item => <Button text={item.chineseName} raised={!(this.state.principlesUsedUp.filter(usedItem => usedItem.id == item.id).length == 1)} key={item.id} onPress={this._handleUsedUpPrinciple.bind(null, item)}/>)}
          </View>
        </Modal>
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
  setting: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: -5
  },
  listView: {
    paddingTop: 10,
  },
  dialog: {
     borderRadius: 2,
     margin: 20,
     padding: 10,
     backgroundColor: '#F5F5F5'
  },
  newKindsOfPrincipleTip: {
    flexDirection: 'column',
  },
  newKindsOfPrincipleTip_text: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: 'center'
  },
  isMainPrinciple: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  isMainPrinciple_Text: {
    textAlignVertical: 'center'
  },
  isMainPrinciple_Switch: {
    marginTop: 2,
  },
  setOrder: {
    flexDirection: 'column',
    height: 250,
    justifyContent: 'space-between'
  },
  setOrder_finished: {
    padding: 15
  }
});
