import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import MessageList from "./components/MessageList";
import Toolbar from "./components/Toolbar";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";
import * as Location from 'expo-location';

class Message extends Component {
  state = {
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
    isInputFocused: false,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    const { fullscreenImageId } = this.state;
    if (fullscreenImageId) {
      this.setState({ fullscreenImageId: null });
      return true;
    }
    return false;
  };

  handlePressMessage = (message) => {
    const { fullscreenImageId } = this.state;
    if (message.type === 'image') {
      this.setState({ fullscreenImageId: fullscreenImageId === message.id ? null : message.id });
    } else {
      this.setState({ fullscreenImageId: null });
    }
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };

  handlePressToolbarLocation = async () => {
    const { messages } = this.state;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude,
          }),
          ...messages,
        ],
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  renderMessageList() {
    const { messages, fullscreenImageId } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} fullscreenImageId={fullscreenImageId} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderMessageList()}
        {this.renderToolbar()}
      </View>
    );
  }
}

const styles = {
  content: {
    flex: 1,
    backgroundColor: 'white'
  },
  toolbar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.04)',
  },
};

export default Message;
