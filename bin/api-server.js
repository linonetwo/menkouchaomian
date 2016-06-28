require('babel-register')({ presets: ['es2015', 'stage-0'], 'plugins': ['babel-relay-plugin-loader'] });
require('babel-polyfill');
require('../api/server.js');
