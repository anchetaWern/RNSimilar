import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native';

import SimilarFaces from './components/SimilarFaces';

const image_picker_options = {
  title: 'Select Photo', 
  takePhotoButtonTitle: 'Take Photo...', 
  chooseFromLibraryButtonTitle: 'Choose from Library...',
  cameraType: 'back', 
  mediaType: 'photo', 
  maxWidth: 480,
  quality: 1, 
  noData: false, 
};
 
//the API Key that you got from Microsoft Azure
const api_key = 'YOUR FACE API KEY';

class RNSimilar extends Component {

  render() {
    return (
      <View style={styles.container}>
        <SimilarFaces imagePickerOptions={image_picker_options} apiKey={api_key} />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  }
});

AppRegistry.registerComponent('RNSimilar', () => RNSimilar);
