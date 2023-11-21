import React, { Component } from 'react';
import { View } from 'react-native';
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from "./utils/MessageUtils";

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
  };

  handlePressMessage = (message) => {
    console.log('Message pressed:', message);
  }

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={this.handlePressMessage} />
      </View>
    );
  }

  render() {
    return this.renderMessageList();
  }
}

const styles = {
  content: {
    flex: 1,
    backgroundColor: '#F8EDE3'
  },
};

export default Message;
