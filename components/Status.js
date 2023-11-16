import React, { Component } from 'react';
import Constants from 'expo-constants';
import { StatusBar, StyleSheet, Text, View, Platform, Animated, Easing } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : 0);

export default class Status extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      bubbleAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      NetInfo.addEventListener(this.handleConnectivityChange);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      NetInfo.removeEventListener(this.handleConnectivityChange);
    }
  }

  handleConnectivityChange = state => {
    this.setState({
      isConnected: state.isConnected,
    });

    Animated.timing(this.state.bubbleAnim, {
      toValue: state.isConnected ? 5 : 0,
      duration: 5000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  render() {
    const { isConnected, bubbleAnim } = this.state;
    const backgroundColor = isConnected ? 'blue' : 'red';
    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? 'dark-content' : 'light-content'}
        animated={false}
      />
    );
    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents="none">
        {statusBar}
        {!isConnected && (
          <Animated.View style={[styles.bubble,{ transform: [ { translateY: bubbleAnim.interpolate({inputRange: [0, 1],
                      outputRange: [0, -80], }), }, ], opacity: bubbleAnim, }, ]} >
            <Text style={styles.text}>No network connection</Text>
          </Animated.View>
        )}
      </View>
    );

    if (Platform.OS === 'ios') {
      return <View style={[styles.status, { backgroundColor }]}></View>;
    }
    return messageContainer;
  }
}

const styles = StyleSheet.create({
  status: {
    zIndex: 1,
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 150,
    right: 0,
    left: 0,
    height: 80,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
  },
  text: {
    color: 'white',
  },
});