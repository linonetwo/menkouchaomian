import express from 'express';
import graphQLHTTP from 'express-graphql';

import config from '../config';
import schema from './schema'; // Schema for GraphQL server


let graphQLServer = express();

graphQLServer.use( '/graphql', graphQLHTTP({
    schema: schema,
    pretty: true,
    graphiql: false,
  })
);
graphQLServer.listen(config.graphQLPort, () => console.log(
  `GraphQL Server is now running on ${config.graphQLHost}/graphql:${config.graphQLPort}`
));

export default graphQLServer;
