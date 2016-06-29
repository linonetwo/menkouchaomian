/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

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
  getPrincipleList
} from '../../api/connect-neo4j'



const MainPrincipleType = new GraphQLObjectType({
  name: 'mainPrinciple',
  fields: () => ({
    id: { type: GraphQLID },
    chineseName: { type: GraphQLString },
  }),
});

const VicePrincipleType = new GraphQLObjectType({
  name: 'vicePrinciple',
  fields: () => ({
    id: { type: GraphQLID },
    chineseName: { type: GraphQLString },
  }),
});

const OrderType = new GraphQLObjectType({
  name: 'order',
  fields: () => ({
    mainPrinciples: { type: new GraphQLList(MainPrincipleType) },
    vicePrinciples: { type: new GraphQLList(VicePrincipleType) },
    id: { type: GraphQLID },
    price: { type: GraphQLFloat }
  }),
});

const PrincipleListType = new GraphQLObjectType({
  name: 'principleList',
  fields: () => ({
    mainPrinciples: { type: new GraphQLList(MainPrincipleType) },
    vicePrinciples: { type: new GraphQLList(VicePrincipleType) }
  }),
});

const QueueType = new GraphQLObjectType({
  name: 'queue',
  fields: () => ({
    queue: { type: new GraphQLList(OrderType) }
  })
})


export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QueryThatLigoudanWants',
    fields: () => ({
      QueueField: {
        type: QueueType,
        resolve: getDatabase,
      },
    }),
  }),
  mutation: new GraphQLObjectType({
    name: 'aaa',
    fields: () => ({
      createPlantField: MutationOfCreatePlant,
      createFeatureField: MutationOfCreateFeature,
      LetPlantArrayHasFeatureField: MutationOfLetPlantArrayHasFeature,
      LetPlantHasFeatureArrayField: MutationOfLetPlantHasFeatureArray,
    }),
  }),
});
