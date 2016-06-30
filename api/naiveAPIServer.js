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
  getPrinciple,
  getPrincipleList,
  getQueue,
  getAll
} from './connect-neo4j'

let apiServer = express();


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


apiServer.use('/', router);

apiServer.listen(config.graphQLPort, () => console.log(
  `Naive Server is now running on ${config.graphQLHost}:${config.graphQLPort}`
));
