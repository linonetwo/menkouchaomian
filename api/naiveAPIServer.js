import express from 'express';
import bodyParser from 'body-parser';
import config from '../config';

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
  paidOrder,
  getPrinciple,
  getPrincipleList,
  getQueue,
  usedUpPrinciple,
  rewindPrinciple,
  getAll,
  shopClose,
  shopOpen,
  setOrderTip
} from './connect-neo4j'

let apiServer = express();

initMetaData();

// configure app to use bodyParser()
// this will let us get the data from a POST
apiServer.use(bodyParser.urlencoded({ extended: true }));
apiServer.use(bodyParser.json());
apiServer.use(require('express-promise')());

let router = express.Router(); // get an instance of the express Router
router.get('/all', function(req, res) {
  res.json(getAll());
});

router.post('/login', function(req, res) {
  let userName = req.body.userName;
  res.json({userInfo: addUser(userName)});
});

router.post('/submitPrinciples', function(req, res) {
  const principlesAdded = JSON.parse(req.body.principlesAdded);
  const principleUUIDList = principlesAdded.map(item => item.id);
  const userUUID = req.body.userUUID;
  res.json({orderUUID: addOrder(principleUUIDList, userUUID)});
});

router.post('/submitNewKindOfPrinciple', async function(req, res) {
  const principleToAdd = req.body.newKindOfPrincipleAdded;
  const price = Number(req.body.price);
  const isMainPrinciple = req.body.isMainPrinciple == 'true';


  let addedResult;
  if (isMainPrinciple) {
    addedResult = await addMainPrinciple(principleToAdd);
  } else {
    addedResult = await addVicePrinciple(principleToAdd);
  }

  if (price > 0) { // NaN > 0 is false
    const principleUUID = await setPriceOfPrinciple(addedResult.id, price);
  }

  res.json({principleUUID: principleUUID});
});

router.post('/orderFinished', function(req, res) {
  const id = req.body.orderUUID;
  res.json({orderUUID: finishOrder(id)});
});

router.post('/orderPaid', function(req, res) {
  const id = req.body.orderUUID;
  res.json({orderUUID: paidOrder(id)});
});

router.post('/orderCanceled', function(req, res) {
  const id = req.body.orderUUID;
  res.json({orderUUID: cancelOrder(id)});
});

router.post('/principlesUsedUp', function(req, res) {
  const id = req.body.principleUUID;
  res.json({principleUUID: usedUpPrinciple(id)});
});

router.post('/principlesRewind', function(req, res) {
  const id = req.body.principleUUID;
  res.json({principleUUID: rewindPrinciple(id)});
});

router.post('/openShop', function(req, res) {
  res.json({cookUUID: shopOpen()});
});

router.post('/closeShop', function(req, res) {
  res.json({cookUUID: shopClose()});
});

router.post('/setOrderTip', function(req, res) {
  const id = req.body.orderUUID;
  const tip = req.body.orderTip;
  console.log(id, tip);
  res.json({principleUUID: setOrderTip(id, tip)});
});


apiServer.use('/', router);

apiServer.listen(config.graphQLPort, () => console.log(
  `Naive Server is now running on ${config.graphQLHost}:${config.graphQLPort}`
));
