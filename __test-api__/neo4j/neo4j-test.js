import chai from 'chai';
const {expect, should, assert} = chai;

import {cleanNodeAndRelationships, NO_RESULT} from '../../api/connect-neo4j'
import {
  addMainPrinciple,
  addVicePrinciple,
  addUser,
  addOrder,
  setPriceOfPrinciple,
  updateOrderPrice,
  getActiveOrder,
  getOrderDetail,
  deletePrincipleFromOrder,
  cancelOrder,
  finishOrder,
  getPrinciple,
  getPrincipleList,
  getQueue
} from '../../api/connect-neo4j'

import config from '../../config';

import uuid from 'node-uuid';
import path from 'path';




describe('addMainPrinciple()', () => {
  before(function() {
    // 在本区块的所有测试用例之前执行
  });

  after(function() {
    // 在本区块的所有测试用例之后执行
  });

  beforeEach(function() { // 可接受函数 done 用于通知异步操作用已经全部完成
    // 在本区块的每个测试用例之前执行
    return cleanNodeAndRelationships(run);
  });

  afterEach(function() {
    // 在本区块的每个测试用例之后执行，一般不放啥，方便肉眼查看结果
  });

  it('add one food 米饭', () => {
    const uuid4Principle = uuid.v4();
    const principleChineseName = '米饭';

    return addMainPrinciple(principleChineseName, uuid4Principle)
    .then(result => expect(result).to.be.deep.equal({
			id: uuid4Principle,
			principle: principleChineseName
		}))
  });
});




describe('addVicePrinciple()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add one food 肉丝', () => {
    const uuid4Principle = uuid.v4();
    const principleChineseName = '肉丝';

    return addVicePrinciple(principleChineseName, uuid4Principle)
    .then(result => expect(result).to.be.deep.equal({
			id: uuid4Principle,
			principle: principleChineseName
		}))
  });
});




describe('addUser()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add one user 林一二', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';

    return addUser(userName, uuid4User)
    .then(result => expect(result).to.be.deep.equal({
			id: uuid4User,
			userName
		}))
  });
});




describe('addOrder()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add an order with 米饭 and 肉丝', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';
    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple = uuid.v4();
    const vicePrincipleChineseName = '肉丝';
    const uuid4Order = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(() => addVicePrinciple(vicePrincipleChineseName, uuid4VicePrinciple))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple], uuid4User, uuid4Order))
    .then(result => expect(result).to.be.deep.equal([uuid4MainPrinciple, uuid4VicePrinciple]))
  });

  it('add two order with 米饭 and 肉丝 or 鸡真', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';

    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';
    const uuid4VicePrinciple2 = uuid.v4();
    const vicePrincipleChineseName2 = '鸡真';

    const uuid4Order1 = uuid.v4();
    const uuid4Order2 = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(() => addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1))
    .then(() => addVicePrinciple(vicePrincipleChineseName2, uuid4VicePrinciple2))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple1], uuid4User, uuid4Order1))
    .then(result => expect(result).to.be.deep.equal([uuid4MainPrinciple, uuid4VicePrinciple1]))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple2], uuid4User, uuid4Order2))
    .then(result => expect(result).to.be.deep.equal([uuid4MainPrinciple, uuid4VicePrinciple2]))
  });
});



describe('setPriceOfPrinciple() updateOrderPrice()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add an order with 米饭 and 肉丝 and 鸡真 then count how much', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';

    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';
    const uuid4VicePrinciple2 = uuid.v4();
    const vicePrincipleChineseName2 = '鸡真';

    const uuid4Order = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(result => setPriceOfPrinciple(result.id, 1))
    .then(() => addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1))
    .then(result => setPriceOfPrinciple(result.id, 2.5))
    .then(() => addVicePrinciple(vicePrincipleChineseName2, uuid4VicePrinciple2))
    .then(result => setPriceOfPrinciple(result.id, 3.0))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple1, uuid4VicePrinciple2], uuid4User, uuid4Order))
    .then(() => updateOrderPrice(uuid4Order))
    .then(result => expect(result).to.be.equal(1 + 2.5 + 3.0))
  });
});




describe('getPrinciple()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add 肉丝 with price then get it by uuid', () => {
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';


    return addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1)
    .then(result => setPriceOfPrinciple(result.id, 2.5))
    .then(() => getPrinciple(uuid4VicePrinciple1))
    .then(result => expect(result).to.be.deep.equal({
      id: uuid4VicePrinciple1,
      chineseName: vicePrincipleChineseName1,
      price: 2.5
    }))
  });


  it('add 肉丝 without price then get it by uuid, price should be NaN', () => {
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';


    return addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1)
    .then(() => getPrinciple(uuid4VicePrinciple1))
    .then(result => expect(result).to.be.deep.equal({
      id: uuid4VicePrinciple1,
      chineseName: vicePrincipleChineseName1,
      price: NaN
    }))
  });
});




describe('getPrincipleList()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add 米饭 and 肉丝 and 鸡真 then return them', () => {
    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';
    const uuid4VicePrinciple2 = uuid.v4();
    const vicePrincipleChineseName2 = '鸡真';


    return addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple)
    .then(result => setPriceOfPrinciple(result.id, 1))
    .then(() => addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1))
    .then(result => setPriceOfPrinciple(result.id, 2.5))
    .then(() => addVicePrinciple(vicePrincipleChineseName2, uuid4VicePrinciple2))
    .then(() => getPrincipleList(uuid4VicePrinciple1))
    .then(result => expect(result).to.be.deep.equal({mainPrinciples: [{id: uuid4MainPrinciple, chineseName: mainPrincipleChineseName, price: 1}], vicePrinciples: [{id: uuid4VicePrinciple1, chineseName: vicePrincipleChineseName1, price: 2.5}, {id: uuid4VicePrinciple2, chineseName: vicePrincipleChineseName2, price: NaN}]}))

  });
});




describe('getActiveOrder()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add two order then get activeOrder themselves', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';

    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';
    const uuid4VicePrinciple2 = uuid.v4();
    const vicePrincipleChineseName2 = '鸡真';

    const uuid4Order1 = uuid.v4();
    const uuid4Order2 = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(result => setPriceOfPrinciple(result.id, 1))
    .then(() => addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1))
    .then(result => setPriceOfPrinciple(result.id, 1))
    .then(() => addVicePrinciple(vicePrincipleChineseName2, uuid4VicePrinciple2))
    .then(result => setPriceOfPrinciple(result.id, 1))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple1], uuid4User, uuid4Order1))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple2], uuid4User, uuid4Order2))

    .then(getActiveOrder)
    .then(results => results.map((result, index) => assert.propertyVal(result, 'id', [uuid4Order1, uuid4Order2][index]) ))

  });
});




describe('getOrderDetail()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it.only('add an order with 米饭 and 肉丝 and 鸡真 then get its detail', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';

    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';
    const uuid4VicePrinciple2 = uuid.v4();
    const vicePrincipleChineseName2 = '鸡真';

    const uuid4Order = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(result => setPriceOfPrinciple(result.id, 1))
    .then(() => addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1))
    .then(result => setPriceOfPrinciple(result.id, 2.5))
    .then(() => addVicePrinciple(vicePrincipleChineseName2, uuid4VicePrinciple2))
    .then(result => setPriceOfPrinciple(result.id, 3.0))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple1, uuid4VicePrinciple2], uuid4User, uuid4Order))
    .then(() => updateOrderPrice(uuid4Order))
    .then(() => getOrderDetail(uuid4Order))
    .then(results => delete results['startTime'] && expect(results).to.be.deep.equal({
      id: uuid4Order,
      price: 1 + 2.5 + 3.0,
      mainPrinciples: [
        {
          id: uuid4MainPrinciple,
          chineseName: mainPrincipleChineseName
        }
      ],
      vicePrinciples: [
        {
          id: uuid4VicePrinciple2,
          chineseName: vicePrincipleChineseName2
        },
        {
          id: uuid4VicePrinciple1,
          chineseName: vicePrincipleChineseName1
        }
      ]
    }))
  });
});




describe('deletePrincipleFromOrder()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add an order with 米饭 and 肉丝 and 鸡真 but delete 鸡真 immediately', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';

    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple1 = uuid.v4();
    const vicePrincipleChineseName1 = '肉丝';
    const uuid4VicePrinciple2 = uuid.v4();
    const vicePrincipleChineseName2 = '鸡真';

    const uuid4Order = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(() => addVicePrinciple(vicePrincipleChineseName1, uuid4VicePrinciple1))
    .then(() => addVicePrinciple(vicePrincipleChineseName2, uuid4VicePrinciple2))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple1, uuid4VicePrinciple2], uuid4User, uuid4Order))
    .then(() => deletePrincipleFromOrder(uuid4VicePrinciple1, uuid4Order))
    .then(results => expect(results).to.be.equal(uuid4Order))
  });
});




describe('cancelOrder()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add an order then cancel it', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';
    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple = uuid.v4();
    const vicePrincipleChineseName = '肉丝';
    const uuid4Order = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(() => addVicePrinciple(vicePrincipleChineseName, uuid4VicePrinciple))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple], uuid4User, uuid4Order))
    .then(() => cancelOrder(uuid4Order))
    .then(result => expect(result).to.be.equal(uuid4Order))
  });
});




describe('finishOrder()', () => {
  beforeEach(function() {
    return cleanNodeAndRelationships(run);
  });

  it('add an order then finish it', () => {
    const uuid4User = uuid.v4();
    const userName = '林一二';
    const uuid4MainPrinciple = uuid.v4();
    const mainPrincipleChineseName = '米饭';
    const uuid4VicePrinciple = uuid.v4();
    const vicePrincipleChineseName = '肉丝';
    const uuid4Order = uuid.v4();


    return addUser(userName, uuid4User)
    .then(() => addMainPrinciple(mainPrincipleChineseName, uuid4MainPrinciple))
    .then(() => addVicePrinciple(vicePrincipleChineseName, uuid4VicePrinciple))
    .then(() => addOrder([uuid4MainPrinciple, uuid4VicePrinciple], uuid4User, uuid4Order))
    .then(() => finishOrder(uuid4Order))
    .then(result => expect(result).to.be.equal(uuid4Order))
  });
});
