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
import PINCode from '@haskkor/react-native-pincode'

var GLOBALS = require('./globals');

export default class OpenExistingWalletModal extends React.Component {

    static navigationOptions = {
         drawerLabel: () => null
    };

    // get the wallet PIN code from keychain
    componentWillMount(){
        if (Platform.OS === 'ios'){
            IosWallet.getWalletPin(this.props.navigation.state.params.walletIndexToOpen, (error, walletpin)=> {
                this.setState({isLoading:false, walletpin: walletpin })
            });
        }
        // android
        else {
            console.log("ANdroid")
        }
    }

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
        AsyncStorage.setItem("walletindex", this.props.navigation.state.params.walletIndexToOpen );
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();

        //
        // if (this.state.hexseed.length != 102){
        //     Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] );
        //     this.setState({isLoading: false})
        // }
        // else {
        //
        //     // Ios
        //     if (Platform.OS === 'ios'){
        //         // check if the hexseed provided for a given index is correct
        //         // IosWallet.checkHexseedIdentical(this.state.hexseed, this.props.navigation.state.params.walletIndexToOpen , (error, status)=> {
        //         IosWallet.checkHexseedIdentical(this.state.hexseed, this.props.navigation.state.params.walletIndexToOpen  , (error, status)=> {
        //             // if correct hexseed
        //             if (status =="success"){
        //                 // update walletindex
        //                 AsyncStorage.setItem("walletindex", this.props.navigation.state.params.walletIndexToOpen );
        //                 this.props.navigation.state.params.onGoBack();
        //                 this.props.navigation.goBack();
        //             }
        //             else {
        //                 Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
        //                 this.setState({isLoading: false});
        //             }
        //         })
        //     }
        //
        //     else {
        //         AndroidWallet.checkHexseedIdentical(this.state.hexseed, this.props.navigation.state.params.walletIndexToOpen, (err) => {console.log(err); }, (status)=> {
        //             // if correct hexseed
        //             if (status =="success"){
        //                 // update walletindex
        //                 AsyncStorage.setItem("walletindex", this.props.navigation.state.params.walletIndexToOpen );
        //                 this.props.navigation.state.params.onGoBack();
        //                 this.props.navigation.goBack();
        //             }
        //             else {
        //                 Alert.alert( "INVALID SEED"  , "The hexseed you provided does not match" , [{text: "OK", onPress: () => console.log('OKEY Pressed')} ] )
        //                 this.setState({isLoading: false});
        //             }
        //         })
        //     }
        // }
    }

  render() {
      if (this.state.isLoading){
            return(<View></View>)
      }
      else {
          return(

              <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>
                  <PINCode
                    status={'enter'}
                    touchIDDisabled={true}
                    storedPin={this.state.walletpin}

                    bottomLeftComponent = {
                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                            <TouchableHighlight onPress={() => this.props.navigation.goBack()  } >
                                <Text style={{color:'white'}}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    }
                    stylePinCodeColorSubtitle ="white"
                    stylePinCodeColorTitle="white"
                    colorPassword="white"
                    numbersButtonOverlayColor="white"
                    finishProcess = { this.openWallet }
                  />
          </ImageBackground>


          );

      }

      // return (
      //     <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
      //     <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
      //         <View style={{flex:1}}>
      //         </View>
      //         <View style={{flex:1, alignItems:'center'}}>
      //             <Text style={styles.bigTitle}>OPEN EXISTING WALLET</Text>
      //
      //                 <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
      //                 <Text style={{color:'white'}}>Enter your hexseed below</Text>
      //
      //             <TextInput onChangeText={ (text) => this._onHexSeedChange(text) } editable={!this.state.isLoading}  underlineColorAndroid="transparent" style={styles.hexInput} />
      //
      //             {this.state.isLoading ?
      //                 <View style={{alignSelf:'center', paddingTop:10}}>
      //                       <ActivityIndicator size={'large'}></ActivityIndicator>
      //                       <Text style={{color:'white'}}>This may take a while.</Text>
      //                       <Text style={{color:'white'}}>Please be patient...</Text>
      //                 </View>
      //                 :
      //                 <View>
      //                     <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={this.openWallet}>
      //                         <Text style={styles.TextStyleWhite}> OPEN WALLET </Text>
      //                     </TouchableOpacity>
      //                     <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={() => this.props.navigation.goBack() }>
      //                         <Text style={styles.TextStyleWhite}> CANCEL </Text>
      //                     </TouchableOpacity>
      //                 </View>
      //             }
      //         </View>
      //     </ImageBackground>
      //     </KeyboardAvoidingView>
      // );
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
