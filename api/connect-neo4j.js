
import { v1 as neo4j } from 'neo4j-driver';

import utils from 'utility';
import uuid from 'node-uuid';
import config from '../config'
import fs from 'fs';
import path from 'path';


// 注入一个方便的用法，看数组是不是包含某个值
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

/*
███    ██ ███████  ██████  ██   ██      ██
████   ██ ██      ██    ██ ██   ██      ██
██ ██  ██ █████   ██    ██ ███████      ██
██  ██ ██ ██      ██    ██      ██ ██   ██
██   ████ ███████  ██████       ██  █████
*/




export const NO_RESULT = Symbol.for('NO_RESULT'); // 用于表示某些查找没有返回结果，这比 null 好

function useNeo4jDB(url, userName, passWord) {
  // Create a driver instance, for the user neo4j with password neo4j.
  const driver = neo4j.driver(`bolt://${url}`, neo4j.auth.basic(userName, passWord));

  // Create a session to run Cypher statements in.
  // Note: Always make sure to close sessions when you are done using them!
  const session = driver.session();

  let _session = session;
  let _lastTransaction = session;


  return (cypherQuery, transaction = undefined) => {
    if (transaction !== undefined) { // 只有 transaction 开关被显式指定了，才进入此分支
      _session = transaction ? session.beginTransaction() : session; // 如果打开事务性开关，就把接下来的所有命令
      // 都放在 session.beginTransaction() 里执行
      if (transaction === true) {
        _lastTransaction = _session; // 每次 transaction 开始后就保存一个 session.beginTransaction() 的副本，以便 commit
      }
    }
    return new Promise((resolve, reject) => {
      if (cypherQuery.query.length === 0 && transaction !== undefined) {
        // cypherQuery 中的请求为空字符串的情况视作只是想修改 transaction 模式
        resolve(_lastTransaction); // 见下方事务性调用的例子
      }

      _session.run(cypherQuery.query, cypherQuery.params)
      .then(result => {
        if (result.records.length === 0 || !result.records[0]) {
          resolve(NO_RESULT); // 没啥结果的时候
        } else {
          resolve(result.records); // 还是有点结果的时候
        }
      })
      .catch(err => reject(err));
    });
  };
}



const run = useNeo4jDB(config.neo4jHost.split('//')[1] + ':' + config.neo4jBoltPort, config.neo4jUserName, config.neo4jPassword);




export function cleanNodeAndRelationships() {
  return run({
    query: 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r'
  });
}


/*
 █████  ██████  ██████
██   ██ ██   ██ ██   ██
███████ ██   ██ ██   ██
██   ██ ██   ██ ██   ██
██   ██ ██████  ██████
*/

export function addMainPrinciple(principleChineseName, newUUID = uuid.v4()) {
  return run({
    query: 'MERGE (n:PRINCIPLE :MAIN_PRINCIPLE {chineseName: {chineseName}}) ON CREATE SET n.uuid={uuid} RETURN n.uuid',
    params: {
      chineseName: principleChineseName,
      uuid: newUUID,
    },
  })
  .then(results => {
    if (results == NO_RESULT) {
      return Promise.reject('No_UUID_RETURN in addMainPrinciple, maybe MERGE operation failed')
    }
    let addedUUID = results[0].get('n.uuid');
    let newMainPrinciple = {
      id: addedUUID,
      principle: principleChineseName,
    };
    return newMainPrinciple;
  })
}




export function addVicePrinciple(principleChineseName, newUUID = uuid.v4()) {
  return run({
    query: 'MERGE (n:PRINCIPLE :VICE_PRINCIPLE {chineseName: {chineseName}}) ON CREATE SET n.uuid={uuid} RETURN n.uuid',
    params: {
      chineseName: principleChineseName,
      uuid: newUUID,
    },
  })
  .then(results => {
    if (results == NO_RESULT) {
      return Promise.reject('No_UUID_RETURN in addVicePrinciple, maybe MERGE operation failed')
    }
    let addedUUID = results[0].get('n.uuid');
    let newMainPrinciple = {
      id: addedUUID,
      principle: principleChineseName,
    };
    return newMainPrinciple;
  })
}


function addPlant(plantChineseName) {
  let newUUID = uuid.v4();
  return run({
    query: 'MERGE (n:PLANT {chineseName: {chineseName}, uuid: {uuid}}) RETURN n.uuid',
    params: {
      chineseName: plantChineseName,
      uuid: newUUID,
    },
  }).then(results => {
    return new Promise(function (resolve, reject) {
      if(results) {
        let addedUUID = results[0]['n.uuid'];
        let newPlant = {
          id: addedUUID,
          text: plantChineseName,
        };
        resolve(newPlant);
      }
      reject(null);
    })
  })
}
//测试
// addPlant('夹竹桃')
// .then(result => console.log(result))
// .catch(err => console.log(err));


function letPlantHasFeature(plantUUID,  featureUUID) {
  let newUUID = uuid.v4();
  return run({
      query: 'MATCH (p:PLANT {uuid: {plantUUID}}), (f:FEATURE {uuid: {featureUUID}}) MERGE (p)-[r:HAS_FEATURE]->(f) ON CREATE SET r.uuid={relationshipUUID} RETURN r.uuid',
      params: {
        plantUUID: plantUUID,
        featureUUID: featureUUID,
        relationshipUUID: newUUID,
      },
  }).then(results => {
    return new Promise(function (resolve, reject) {
      if(results) {
        let addedUUID = results[0]['r.uuid'];
        resolve(addedUUID);
      }
      reject(null);
    })
  })
}
//测试
// letPlantHasFeature('50e2af0f-c4ac-419a-af24-551fc7c8320a', 'f4b07f87-7c86-412c-807e-677b5cf326ae')
// .then(result => console.log(result))
// .catch(err => console.log(err));


function letPlantArrayHasFeature(plantArray, featureUUID) {
  let promiseArray = [];
  for(let plantUUID of plantArray) {
    promiseArray.push( letPlantHasFeature(plantUUID, featureUUID) );
  }
  return Promise.all( promiseArray ).then( ()=>getRelationShip() )
}
//测试
// letPlantArrayHasFeature(['3d79fc0c-99ee-46d4-88cd-e3e23932a8dc', 'da7c49b7-14be-44df-a85c-f9eeb8c2837c'], 'fa95404c-df7e-4aa5-9b7b-1a22b71faf86')
// .then( result => console.log('asdfasdf') );


function letPlantHasFeatureArray(plantUUID, featureArray) {
  let promiseArray = [];
  for(let featureUUID of featureArray) {
    promiseArray.push( letPlantHasFeature(plantUUID, featureUUID) );
  }
  return Promise.all( promiseArray ).then( ()=>getRelationShip() )
}
//测试
// letPlantHasFeatureArray('3d79fc0c-99ee-46d4-88cd-e3e23932a8dc', ['04beb8c8-9bbe-4e34-a2e8-814994c40841', 'fa95404c-df7e-4aa5-9b7b-1a22b71faf86'] )
// .then( result => console.log('asdfasdf') );



/*
 ██████  ███████ ████████
██       ██         ██
██   ███ █████      ██
██    ██ ██         ██
 ██████  ███████    ██
*/




function getDatabase() {
  let promiseArray = [getPlant(), getFeature(), getRelationShip()];
  return Promise.all( promiseArray )
  .then( resultArray=>{
    // 似乎 node 还不支持 Promise.resolve(value)
    return new Promise(function (resolve, reject) {
      resolve({
        forPlant: resultArray[0],
        forFeature: resultArray[1],
        forRelationship: resultArray[2]
      })
    })
  })
  .catch(err => console.log(err));
}
// 测试
// getDatabase()
// .then( results => console.log(results))
// .catch(err => console.log(err));


function getPlant() {
  return run({
    query: 'MATCH (p:PLANT) RETURN p.uuid AS id, p.chineseName AS text',
  }).then(results => {
    return new Promise(function (resolve, reject) {
      let forPlant = {
        plantArray: [],
        id: '42',
      }
      if(results) {
        /*
        [ { 'id': '50e2af0f-c4ac-419a-af24-551fc7c8320a',
            'text': '侧柏' },
          { 'id': '8b1bf568-277e-4a5b-9953-77e2dc9ff85d',
            'text': 'bbb' } ]
        */
        forPlant.plantArray = results;
        resolve(forPlant);
      }
      resolve(forPlant);
    })
  })
}


function getFeature() {
  return run({
    query: 'MATCH (p:FEATURE) RETURN p.uuid AS id, p.chineseName AS text',
  }).then(results => {
    return new Promise(function (resolve, reject) {
      let forFeature = {
        featureArray: [],
        id: '12',
      }
      if(results) {
        /*
        [ { 'id': '50e2af0f-c4ac-419a-af24-551fc7c8320a',
            'text': '侧柏' },
          { 'id': '8b1bf568-277e-4a5b-9953-77e2dc9ff85d',
            'text': 'bbb' } ]
        */
        forFeature.featureArray = results;
        resolve(forFeature);
      }
      resolve(forFeature);
    })
  })
}


function getRelationShip() {
  return run({
      query: 'MATCH (p:PLANT)-[r]->(f:FEATURE) RETURN {plant : {id: p.uuid, text: p.chineseName},id: r.uuid , feature: {id: f.uuid, text: f.chineseName} } AS result ORDER BY p.chineseName',
  }).then(results => {
    // [ { result:
    //    { plant: [Object],
    //      id: 'b2bbdf0a-8895-4603-86a9-7cb429bb8a2f',
    //      feature: [Object] } },
    // { result:
    //    { plant: [Object],
    //      id: 'a7841392-8798-4055-b72f-655da46a64f4',
    //      feature: [Object] } } ]
    return new Promise(function (resolve, reject) {
      let forRelationship = {
        relationshipArray: [],
        id: '100',
      };
      if(results) {
        for(let result of results) {
          forRelationship.relationshipArray.push( result.result );
        }
        resolve(forRelationship);
      }
      resolve(forRelationship);
    })
  })
}
