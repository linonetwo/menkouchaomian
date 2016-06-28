import chai from 'chai';
const {expect, should} = chai;

import {cleanNodeAndRelationships, NO_RESULT} from '../../api/connect-neo4j'
import {addMainPrinciple, addVicePrinciple} from '../../api/connect-neo4j'

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

  it('add one food 米饭', () => {
    const uuid4Principle = uuid.v4();
    const principleChineseName = '米饭';

    return addVicePrinciple(principleChineseName, uuid4Principle)
    .then(result => expect(result).to.be.deep.equal({
			id: uuid4Principle,
			principle: principleChineseName
		}))
  });
});
