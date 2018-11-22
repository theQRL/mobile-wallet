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

export default class OpenExistingWalletModal extends React.Component {

    static navigationOptions = {
         drawerLabel: () => null
    };

    state={
        hexseed: GLOBALS.hexseed2,
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
            Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] );
            this.setState({isLoading: false})
        }
        else {

            // Ios
            if (Platform.OS === 'ios'){
                // check if the hexseed provided for a given index is correct
                // IosWallet.checkHexseedIdentical(this.state.hexseed, this.props.navigation.state.params.walletIndexToOpen , (error, status)=> {
                IosWallet.checkHexseedIdentical(this.state.hexseed, this.props.navigation.state.params.walletIndexToOpen  , (error, status)=> {
                    console.log(status)
                    // if correct hexseed
                    if (status =="success"){
                        // update walletindex
                        AsyncStorage.setItem("walletindex", this.props.navigation.state.params.walletIndexToOpen );
                        this.props.navigation.state.params.onGoBack();
                        this.props.navigation.goBack();
                    }
                    else {
                        Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
                        this.setState({isLoading: false});
                    }

                })


            //     IosWallet.openWalletWithHexseed(this.state.hexseed, walletIndexToCreate , (error, status, address)=> {
            //         this.setState({isLoading:false})
            //         // if success -> open the main view of the app
            //         if (status =="success"){
            //             AsyncStorage.setItem("walletcreated","yes");
            //             // update the walletindex
            //             AsyncStorage.setItem("walletindex",walletIndexToCreate );
            //             // update the walletlist JSON
            //             // if first wallet create, just instantiate the walletlist JSON
            //             if (walletIndexToCreate == "1"){
            //                 AsyncStorage.setItem("walletlist", JSON.stringify( [{"index":walletIndexToCreate, "address": "Q"+address}] ) );
            //             }
            //             else {
            //                 // update walletlist JSON
            //                 AsyncStorage.getItem("walletlist").then((walletlist) => {
            //                     walletlist = JSON.parse(walletlist)
            //                     console.log("KEYSLEN")
            //                     console.log(Object.keys(walletlist).length)
            //                     walletlist.push({"index":walletIndexToCreate, "address": "Q"+address})
            //                     // walletlist.push(JSON.stringify( {"index":walletIndexToCreate, "address": "Q"+address} ) );
            //                     AsyncStorage.setItem("walletlist", JSON.stringify( walletlist ));
            //                 });
            //             }
            //
            //             this.props.navigation.navigate('App');
            //         }
            //         else {
            //             Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
            //         }
            //     })
            // }
            // // Android
            // else {
            //   AndroidWallet.openWalletWithHexseed(this.state.hexseed, (err) => {console.log(err); } , (status)=> {
            //       this.setState({isLoading:false})
            //       // if success -> open the main view of the app
            //       if (status =="success"){
            //           AsyncStorage.setItem("walletcreated","yes");
            //           // update the walletindex
            //           AsyncStorage.setItem("walletindex",walletIndexToCreate );
            //           this.props.navigation.navigate('App');
            //       }
            //       else {
            //           Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
            //       }
            //   })

            }
        }
    }

  render() {
      return (
          <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
          <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
              <View style={{flex:1}}>
              </View>
              <View style={{flex:1, alignItems:'center'}}>
                  <Text style={styles.bigTitle}>OPEN EXISTING WALLET</Text>

                      <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                      <Text style={{color:'white'}}>Enter your hexseed below</Text>

                  <TextInput onChangeText={ (text) => this._onHexSeedChange(text) } editable={!this.state.isLoading}  underlineColorAndroid="transparent" style={styles.hexInput} />

                  {this.state.isLoading ?
                      <View style={{alignSelf:'center', paddingTop:10}}>
                            <ActivityIndicator size={'large'}></ActivityIndicator>
                            <Text style={{color:'white'}}>This may take a while.</Text>
                            <Text style={{color:'white'}}>Please be patient...</Text>
                      </View>
                      :
                      <View>
                          <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={this.openWallet}>
                              <Text style={styles.TextStyleWhite}> OPEN WALLET </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={() => this.props.navigation.goBack() }>
                              <Text style={styles.TextStyleWhite}> CANCEL </Text>
                          </TouchableOpacity>
                      </View>
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
