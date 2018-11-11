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
  Alert,
  TouchableHighlight,
  KeyboardAvoidingView
} from 'react-native';

// Android and Ios native modules
import {NativeModules} from 'react-native';
// ios
var IosWallet = NativeModules.CreateWallet;
// android
var AndroidWallet = NativeModules.AndroidWallet;

var GLOBALS = require('./globals');

export default class OpenExistingWallet extends React.Component {

    state={
        hexseed: GLOBALS.hexseed,
        // hexseed : "",
        isLoading: false
    }

    _onHexSeedChange = (text) => {
        this.setState({hexseed:text});
    }

  // open QRL wallet
  openWallet = () => {

      this.setState({isLoading: true})
    if (this.state.hexseed.length != 102){
        Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
    }
    else {
        // Ios
        if (Platform.OS === 'ios'){
            IosWallet.openWalletWithHexseed(this.state.hexseed,(error, status)=> {
                this.setState({isLoading:false})
                // if success -> open the main view of the app
                if (status =="success"){
                    AsyncStorage.setItem("walletcreated","yes");
                    this.props.navigation.navigate('App');
                }
                else {
                    Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
                }
            })
        }
        // Android
        else {
          AndroidWallet.openWalletWithHexseed(this.state.hexseed, (err) => {console.log(err); } , (status)=> {
              this.setState({isLoading:false})
              // if success -> open the main view of the app
              if (status =="success"){
                  AsyncStorage.setItem("walletcreated","yes");
                  this.props.navigation.navigate('App');
              }
              else {
                  Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
              }
          })
        }
    }
  }

  render() {
      console.log("HEXSEED IS: ", this.state.hexseed)
      return (
          <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
          <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
              <View style={{flex:1}}>
              </View>
              <View style={{flex:1, alignItems:'center'}}>
                  <Text style={styles.bigTitle}>OPEN EXISTING WALLET</Text>

                      <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                      <Text style={{color:'white'}}>Enter your hexseed below</Text>

                  <TextInput onChangeText={ (text) => this._onHexSeedChange(text) } underlineColorAndroid="transparent" style={styles.hexInput} />

                  {this.state.isLoading ?
                      <View style={{alignSelf:'center', paddingTop:10}}>
                            <ActivityIndicator size={'large'}></ActivityIndicator>
                            <Text style={{color:'white'}}>This may take a while.</Text>
                            <Text style={{color:'white'}}>Please be patient...</Text>
                      </View>
                      :
                      <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={this.openWallet}>
                          <Text style={styles.TextStyleWhite}> OPEN WALLET </Text>
                      </TouchableOpacity>
                  }
              </View>
          </ImageBackground>
          </KeyboardAvoidingView>
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
    TextStyleWhite:{
        color:'white',
        textAlign:'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    hexInput:{
        backgroundColor:'#ebe8e8',
        height:50,
        width:300,
        borderRadius:10,
        marginTop:15
    }
});
