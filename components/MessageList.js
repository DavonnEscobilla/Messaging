import React from 'react';
import { PropTypes } from 'prop-types';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MassageShape } from '../utils/MessageUtils';

const keyExtractor = item => item.id.toString();

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MassageShape),
    onPressMessage: PropTypes.func,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  state = {
    fullscreenImageId: null,
  };

  handlePressImage = (imageId) => {
    this.setState({ fullscreenImageId: imageId });
  };

  handleCloseFullscreen = () => {
    this.setState({ fullscreenImageId: null });
  };

  renderMessageContent = ({ item }) => {
    const { fullscreenImageId } = this.state;
    const { onPressMessage } = this.props;

    const isFullscreen = item.type === 'image' && item.id === fullscreenImageId;

    return (
      <View style={styles.messageRow}>
        {item.type === 'text' && (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        {item.type === 'image' && (
          <TouchableOpacity onPress={() => this.handlePressImage(item.id)} style={styles.imageContainer}>
            <Image style={[styles.image, isFullscreen && styles.fullscreenImage]} source={{ uri: 'https://artgallery.yale.edu/sites/default/files/styles/hero_small/public/2023-01/ag-doc-2281-0036-pub.jpg?h=147a4df9&itok=uclO7OrF' }} />
          </TouchableOpacity>
        )}
        {item.type === 'location' && (
          <View style={styles}>
            {item.coordinate && (
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    ...item.coordinate,
                    latitudeDelta: 0.08,
                    longitudeDelta: 0.04,
                  }}
                >
                  <Marker coordinate={item.coordinate} />
                </MapView>
              </View>
            )}
            {!item.coordinate && <Text style={styles.locationText}>Location data is missing</Text>}
          </View>
        )}
      </View>
    );
  };

  render() {
    const { messages } = this.props;
    const { fullscreenImageId } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          inverted
          data={messages}
          renderItem={this.renderMessageContent}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={styles.contentContainer}
        />
        <Modal visible={!!fullscreenImageId} transparent>
          <TouchableOpacity style={styles.modalBackground} onPress={this.handleCloseFullscreen}>
            <Image style={styles.modalImage} source={{ uri: 'https://artgallery.yale.edu/sites/default/files/styles/hero_small/public/2023-01/ag-doc-2281-0036-pub.jpg?h=147a4df9&itok=uclO7OrF' }} />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
    backgroundColor: '#b2ffff',
    marginTop: 25,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    height: 400,
    width: 400,
    borderRadius: 8,
  },
  mapContainer: {
    height: 300,
    width: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
  locationText: {
    color: 'red',
    fontStyle: 'italic',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalImage: {
    height: 300,
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
});
