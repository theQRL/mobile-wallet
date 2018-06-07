import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Image,
  ActionSheetIOS,
  TextInput,
  Modal,
  Button,
  ActivityIndicator,
  Picker,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';



export default class CreateWalletHashFunction extends React.Component {

  static navigationOptions = {
      headerMode: 'none'
  };

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };

  state={
      address: '',
      passphrase : '',
      treeHeight: "0",
      signatureCounts : 0,
      hashFunction: '',
      processing: false,
      dimensions : undefined,
      y1:0,
      y2:0,
      y3:0,
      showModal: false,
      selectText : undefined
  }

  showModal = () => {
      var y3 = this.state.y1 + this.state.y2 - 100
      this.setState({y3: y3, showModal: true})
  }

  updateHeight = (height) => {
      this.setState({treeHeight:height, showModal:false});
      if (height== 8){this.setState({selectText:"HASH FUNCTION: SHAKE_128"})}
      if (height== 10){this.setState({selectText:"HASH FUNCTION: SHAKE_256"})}
      if (height== 12){this.setState({selectText:"HASH FUNCTION: SHA2_256"})}
  }

    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.setState({loading:true})
      setTimeout(() => {
          this.props.navigation.navigate('App');
      }, 2500);

    };

  render() {
      // this.helloWorld();

      return (
          <ImageBackground source={require('../resources/images/signin_process_hashfunction_bg.png')} style={styles.backgroundImage}>

              <Modal visible={this.state.showModal} transparent={true}>
                  <View style={{borderRadius:10, alignItems:'center', alignSelf:'center', justifyContent:'center',backgroundColor:'white', top:this.state.y3, left:this.state.modalx, width:300, position:'absolute'}}>
                      <TouchableHighlight style={styles.selection} onPress={() => this.updateHeight(8)}>
                          <Text style={styles.selectionText}>HASH FUNCTION: SHAKE_128</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.selection2} onPress={() => this.updateHeight(10)}>
                          <Text style={styles.selectionText}>HASH FUNCTION: SHAKE_256</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.selection} onPress={() => this.updateHeight(12)}>
                          <Text style={styles.selectionText}>HASH FUNCTION: SHA2_256</Text>
                      </TouchableHighlight>
                  </View>
              </Modal>

              <View style={{flex:1}}>
              </View>
              <View style={{flex:1, alignItems:'center'}} ref='Marker2' onLayout={({nativeEvent}) => {
          this.refs.Marker2.measure((x, y, width, height, pageX, pageY) => {this.setState({y1:y});}) }}>
                  <Text>SET UP YOUR WALLET</Text>
                  <Text style={styles.bigTitle}>HASH FUNCTION</Text>
                  <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                  <Text style={{color:'white'}}>Select your preferred hash function</Text>
                  <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.showModal} ref='Marker' onLayout={({nativeEvent}) => {
                  this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {this.setState({y2:y, modalx:x});})}}>
                      {this.state.selectText ? <Text style={styles.TextStyle}> {this.state.selectText} </Text>: <Text style={styles.TextStyle}> CHOOSE A HASH FUNCTION </Text> }
                  </TouchableOpacity>

                  {this.state.selectText ?  <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={ this._signInAsync }><Text style={styles.TextStyleWhite}> CONTINUE </Text></TouchableOpacity>: undefined }
                  {this.state.loading? <ActivityIndicator size={'large'}></ActivityIndicator> : undefined}
              </View>
          </ImageBackground>
      );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionText:{
      color: '#1e79cb',
  },
  selection: {
      width:300,
      height:50,
      alignSelf:'center',
      justifyContent:'center',
      paddingLeft:50,
  },
  selection2: {
      backgroundColor:'#f6f6f6',
      width:300,
      height:50,
      alignSelf:'center',
      justifyContent:'center',
      paddingLeft:50,
  },
  bigTitle:{
      color:'white',
      fontSize: 25,
  },
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  welcomeBig: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  welcomeRed: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: "red"
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  SubmitButtonStyle: {
      width: 300,
      height:50,
      marginTop:10,
      paddingTop:15,
      paddingBottom:15,
      marginLeft:30,
      marginRight:30,
      backgroundColor:'white',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff'
  },
  SubmitButtonStyleDark: {
      width: 300,
      marginTop:10,
      paddingTop:15,
      paddingBottom:15,
      marginLeft:30,
      marginRight:30,
      backgroundColor:'#144b82',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#144b82'
  },
  TextStyle:{
    color:'#1e79cb',
    textAlign:'center',
},
TextStyleWhite:{
  color:'white',
  textAlign:'center',
},
backgroundImage: {
  flex: 1,
  // remove width and height to override fixed static size
  width: null,
  height: null,
},


});
