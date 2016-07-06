import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView
} from 'react-native';

import React, { Component } from 'react';

import NativeModules, { ImagePickerManager } from 'NativeModules';
import Button from 'react-native-button';

import Requestor from '../lib/Requestor';

let facelist_id = 'YOUR FACE LIST ID';
let facelist_data = {
  name: 'YOUR FACE LIST NAME'
};

let face_api_base_url = 'https://api.projectoxford.ai';

export default class SimilarFaces extends Component {
  constructor(props) {
  	super(props);
  	this.state = {
      name: '',
  		photo_style: {
  			width: 480,
  			height: 480
  		},
  		photo: null,
      similar_photo: null,
      message: ''
  	};
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Button
            containerStyle={styles.button}
            onPress={this._createFaceList.bind(this)}>
            Create Face List
          </Button>

          <Image
            style={this.state.photo_style}
            source={this.state.photo}
            resizeMode={"contain"}
          />
         
          <Button
            containerStyle={styles.button}
            onPress={this._pickImage.bind(this)}>
            Pick Image
          </Button>

          <TextInput
            style={styles.text_input}
            onChangeText={this._changeName.bind(this)}
            value={this.state.name}
            placeholder={"name"}
          />

      		<Button
    		    containerStyle={styles.button}
    		    onPress={this._addFaceToFaceList.bind(this)}>
    		    Add Face to Face List
      		</Button>

      		<Button
    		    containerStyle={styles.button}
    		    onPress={this._getSimilarFace.bind(this)}>
    		    Get Similar Face
      		</Button>

          <Image
            style={this.state.photo_style}
            source={this.state.similar_photo}
            resizeMode={"contain"}
          />

          <Text style={styles.message}>{this.state.message}</Text>
        </View>
      </ScrollView>
      
    );
  }

  _changeName(text) {
    this.setState({
      name: text
    });
  }

  _pickImage() {

    ImagePickerManager.showImagePicker(this.props.imagePickerOptions, (response) => {
         
      if(response.error){
        alert('Error getting the image. Please try again.');
      }else{
        
        let source = {uri: response.uri};
        
        this.setState({
          photo_style: {
            width: response.width,
            height: response.height
          },
          photo: source,
          photo_data: response.data
        });
         
      }
    });
   
  }

  _createFaceList() {

    Requestor.request(
      face_api_base_url + '/face/v1.0/facelists/' + facelist_id,
      'PUT',
      this.props.apiKey,
      JSON.stringify(facelist_data)
    )
    .then(function(res){
      alert('Face List Created!');
    });

  }

  _addFaceToFaceList() {

    var user_data = {
      name: this.state.name,
      filename: this.state.photo.uri
    };

    Requestor.upload(
      face_api_base_url + '/face/v1.0/facelists/' + facelist_id + '/persistedFaces',
      this.props.apiKey,
      this.state.photo_data,
      {
        userData: JSON.stringify(user_data)
      }
    )
    .then((res) => {

      alert('Face was added to face list!');
    
    });
   
  }

  _getSimilarFace() {
  
    Requestor.upload(
      face_api_base_url + '/face/v1.0/detect',
      this.props.apiKey,
      this.state.photo_data
    )
    .then((facedetect_res) => {
      
      let face_id = facedetect_res[0].faceId;

      let data = {
        faceId: face_id,
        faceListId: facelist_id,
        maxNumOfCandidatesReturned: 2
      }

      Requestor.request(
        face_api_base_url + '/face/v1.0/findsimilars', 
        'POST', 
        this.props.apiKey,
        JSON.stringify(data)
      )
      .then((similarfaces_res) => {

        let similar_face = similarfaces_res[1];
        
        Requestor.request(
          face_api_base_url + '/face/v1.0/facelists/' + facelist_id,
          'GET',
          this.props.apiKey
        )
        .then((facelist_res) => {

          let user_data = {};
          facelist_res['persistedFaces'].forEach((face) => {
            if(face.persistedFaceId == similar_face.persistedFaceId){
              user_data = JSON.parse(face.userData);
            }
          });

          this.setState({
            similar_photo: {uri: user_data.filename},
            message: 'Similar to: ' + user_data.name + ' with confidence of ' + similar_face.confidence
          });

        });
        
      });
      
    });

  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   	alignItems: 'center'
  },
  button: {
    padding: 10,
    margin: 20,
    height: 45,
    overflow: 'hidden', 
    backgroundColor: 'white'
  },
  text_input: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
    backgroundColor: '#FFF'
  },
  message: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

AppRegistry.registerComponent('SimilarFaces', () => SimilarFaces);