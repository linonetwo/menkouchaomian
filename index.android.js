import {
  AppRegistry
} from 'react-native';

import ApplicationMain from './app/container/ApplicationMain';
import config from './config';

import Relay from 'react-relay';


AppRegistry.registerComponent('Menkouchaofan', () => {

  Relay.injectNetworkLayer(
    new Relay.DefaultNetworkLayer(`${config.graphQLHost}/graphql`, {
      fetchTimeout: 30000,
      retryDelays: [5000, 10000],
    })
  );
  
  return ApplicationMain;
});
