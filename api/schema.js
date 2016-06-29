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
  getDatabase,
  addPlant,
  getPlant,
  addFeature,
  getFeature,
  getRelationShip,
  letPlantArrayHasFeature,
  letPlantHasFeatureArray,
} from './connect-neo4j';



const PlantType = new GraphQLObjectType({
  name: 'NameOfPlantType',
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
  }),
});

const PlantListType = new GraphQLObjectType({
  name: 'NameOfPlantListType',
  fields: () => ({
    plantArray: { type: new GraphQLList(PlantType) },
    id: { type: GraphQLString },
  }),
});


const FeatureType = new GraphQLObjectType({
  name: 'NameOfFeatureType',
  fields: () => ({
    id: { type: GraphQLID },
    text: { type: GraphQLString },
  }),
});

const FeatureListType = new GraphQLObjectType({
  name: 'NameOfFeatureListType',
  fields: () => ({
    featureArray: { type: new GraphQLList(FeatureType) },
    id: { type: GraphQLString },
  }),
});


const RelationshipType = new GraphQLObjectType({
  name: 'NameOfRelationshipType',
  fields: () => ({
    plant: { type: PlantType },
    id: { type: GraphQLID },
    feature: { type: FeatureType },
  }),
});

const RelationshipListType = new GraphQLObjectType({
  name: 'NameOfRelationshipListType',
  fields: () => ({
    relationshipArray: { type: new GraphQLList(RelationshipType) },
    id: { type: GraphQLString },
  }),
});


const TaoTaoType = new GraphQLObjectType({
  name: 'NameOfTaoTaoType',
  fields: () => ({
    forPlant: { type: PlantListType },
    forFeature: { type: FeatureListType },
    forRelationship: { type: RelationshipListType },
  }),
});



const MutationOfCreatePlant = mutationWithClientMutationId({
  name: 'NameOfCreateNewPlantasdfasdf',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    plantListFromMutationOutputFields: {
      type: PlantListType,
      resolve: getPlant,
    },
  },
  mutateAndGetPayload: ({ text }) => {
    const newPlant = addPlant(text);
    return newPlant;
  },
});


const MutationOfCreateFeature = mutationWithClientMutationId({
  name: 'NameOfCreateNewFeatureasdfasdf',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    featureListFromMutationOutputFields: {
      type: FeatureListType,
      resolve: getFeature,
    },
  },
  mutateAndGetPayload: ({ text }) => {
    const newFeature = addFeature(text);
    return newFeature;
  },
});


const MutationOfLetPlantArrayHasFeature = mutationWithClientMutationId({
  name: 'NameOfMutationOfLetPlantArrayHasFeatureasdfasdf',
  inputFields: {
    plantUUIDArray: { type: new GraphQLList(GraphQLString) },
    featureUUID: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    relationshipListFromMutationOutputFields: {
      type: RelationshipListType,
      resolve: getRelationShip,
    },
  },
  mutateAndGetPayload: ({ plantUUIDArray, featureUUID }) => {
    const relationships = letPlantArrayHasFeature(plantUUIDArray, featureUUID);
    return relationships;
  },
});


const MutationOfLetPlantHasFeatureArray = mutationWithClientMutationId({
  name: 'NameOfMutationOfLetPlantHasFeatureArrayasdfasdf',
  inputFields: {
    plantUUID: { type: new GraphQLNonNull(GraphQLString) },
    featureUUIDArray: { type: new GraphQLList(GraphQLString) },
  },
  outputFields: {
    relationshipListFromMutationOutputFields: {
      type: RelationshipListType,
      resolve: getRelationShip,
    },
  },
  mutateAndGetPayload: ({ plantUUID, featureUUIDArray }) => {
    const relationships = letPlantHasFeatureArray(plantUUID, featureUUIDArray);
    return relationships;
  },
});


export const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'QueryThatLigoudanWants',
    fields: () => ({
      TaoTaoFIeld: {
        type: TaoTaoType,
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
