/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  Component,
} from 'react';

import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';


import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

var API_KEY = '7waqfqbprs7pajbz28mqf6vz';
var API_URL = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json';
var PAGE_SIZE = 25;
var PARAMS = '?apikey=' + API_KEY + '&page_limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL + PARAMS;

const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'Second',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
  {
    title: 'First',
    content: 'Lorem ipsum...',
  },
];

class Menkouchaofan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      isRefreshing: false,
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  _renderHeader = (section, index, isActive) => {
    return (
      <Animatable.View
        style={styles.header}
        duration={300}
        transition="backgroundColor"
        style={{ backgroundColor: (isActive ? 'rgba(255,255,255,1)' : '#66CCFF') }}>
        <Text style={styles.title}>{section.title}</Text>
      </Animatable.View>
    );
  }

  _renderContent = (section, i, isActive) => {
    return (
      <Animatable.View
        style={styles.content}
        duration={300}
        transition="backgroundColor"
        style={{ backgroundColor: (isActive ? 'rgba(255,255,255,1)' : '#66CCFF') }}>
        <TouchableOpacity
          style={{margin: 5}}
          onPress={() => this.setState({isRefreshing: !this.state.isRefreshing})}>
          <Animatable.Text
            duration={300}
            easing="ease-out"
            animation={isActive ? 'zoomIn' : false}>
            {section.content}
          </Animatable.Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  _fetchData = () => {
    this.setState({isRefreshing: true});
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
          isRefreshing: false,
        });
        console.log(responseData);
      })
      .done();
  }


  render() {
    if (!this.state.loaded) {
      return this._renderLoadingView();
    }

    return (
        <ScrollView
          contentContainerStyle={styles.listView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._fetchData}
              enable={true}
            />}
          >
            {/*<ListView
              dataSource={this.state.dataSource}
              renderRow={this._renderMovie}
            />*/}
            <Accordion
              sections={SECTIONS}
              renderHeader={this._renderHeader}
              renderContent={this._renderContent}
            />
        </ScrollView>
    );
  }

  _renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  }

  _renderMovie = (movie) => {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.posters.thumbnail}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>{movie.year}</Text>
        </View>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('Menkouchaofan', () => Menkouchaofan);
