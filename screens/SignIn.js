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
  Button,
  ActivityIndicator,
  Picker,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';


export default class SignIn extends React.Component {

  state={
      address: '',
      passphrase : '',
      treeHeight: "0",
      signatureCounts : 0,
      hashFunction: '',
      processing: false
  }

  render() {
      // this.helloWorld();
      return (
          <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
              <View style={{flex:1}}>
              </View>
              <View style={{flex:1, alignItems:'center'}}>
                  <Text>WELCOME</Text>
                  <Text style={styles.bigTitle}>LOGIN / CREATE</Text>

                      <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                      <Text style={{color:'white'}}>Create your QRL wallet following 2 simple steps</Text>
                  <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={() => this.props.navigation.push('CreateWalletTreeHeight')}>
                      <Text style={styles.TextStyle}> CREATE NEW WALLET </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={ this._signInAsync }>
                      <Text style={styles.TextStyleWhite}> OPEN EXISTING WALLET </Text>
                  </TouchableOpacity>
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
