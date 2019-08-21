import React, { Component } from 'react';
import {Platform, StyleSheet, ImageBackground, Text, View, Image, ActionSheetIOS, TextInput, Button, ActivityIndicator, Picker, AsyncStorage, TouchableOpacity, Alert, Modal, TouchableHighlight, KeyboardAvoidingView} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles.js';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;

var GLOBALS = require('./globals');
import PINCode from '@haskkor/react-native-pincode'
import QRCodeScanner from 'react-native-qrcode-scanner';

export default class OpenExistingWalletOptions extends React.Component {

    componentDidMount(){
        const hexseed = this.props.navigation.getParam('hexseed', 'nohexseed');
        if (hexseed == "nohexseed"){
            // this.setState({hexseed: "" })
            this.setState({ hexseed: GLOBALS.mnemonic })
        }
        else {
            this.setState({hexseed: hexseed})
        }
    }

    state={
        isLoading: false,
        pin: null,
        modalVisible:false,
        hexModalVisible: false
    }

    // udpate hexseed
    _onHexSeedChange = (text) => {
        this.setState({hexseed:text});
    }

    // update walletcounter
    _updateWalletcounter = (walletcounterUpdate) => {
        AsyncStorage.setItem("walletcounter", walletcounterUpdate);
    }

    // udpate to opened wallet index
    _updateWalletIndex = (walletIndexToCreate, address) => {
        AsyncStorage.setItem("walletcreated","yes");
        // update the walletindex
        AsyncStorage.setItem("walletindex",walletIndexToCreate );
        // update the walletlist JSON
        // if first wallet create, just instantiate the walletlist JSON
        if (walletIndexToCreate == "1"){
            AsyncStorage.setItem("walletlist", JSON.stringify( [{"index":walletIndexToCreate, "address": "Q"+address}] ) );
        }
        else {
            // update walletlist JSON
            AsyncStorage.getItem("walletlist").then((walletlist) => {
                walletlist = JSON.parse(walletlist)
                walletlist.push({"index":walletIndexToCreate, "address": "Q"+address})
                AsyncStorage.setItem("walletlist", JSON.stringify( walletlist ));
            });
        }
        // show main menu once wallet is open
        this.props.navigation.navigate('App');
    }

    // open QRL wallet
    openWallet = () => {
        this.setState({isLoading: true})
        if (this.state.hexseed.length != 102){
            Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] );
            this.setState({isLoading: false})
        }
        else {
            AsyncStorage.getItem('walletcounter').then((walletcounter) => {
                // if not first wallet
                if(walletcounter != null){
                    walletIndexToCreate = (parseInt(walletcounter, 10) + 1).toString();
                    this._updateWalletcounter(walletIndexToCreate)
                }
                // if first wallet
                else {
                    walletIndexToCreate = "1"
                    this._updateWalletcounter("1");
                }
                // Ios
                if (Platform.OS === 'ios'){
                    IosWallet.openWalletWithHexseed(this.state.hexseed, walletIndexToCreate, this.state.pin, (error, status, address)=> {
                        this.setState({isLoading:false})
                        // if success -> open the main view of the app
                        if (status =="success"){
                            this._updateWalletIndex(walletIndexToCreate, address)
                        }
                        else {
                            Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
                        }
                    })
                }
                // Android
                else {
                  AndroidWallet.openWalletWithHexseed(this.state.hexseed, walletIndexToCreate, this.state.pin, (err) => {console.log(err); } , (status, address)=> {
                      this.setState({isLoading:false})
                      // if success -> open the main view of the app
                      if (status =="success"){
                          this._updateWalletIndex(walletIndexToCreate, address)
                      }
                      else {
                          Alert.alert( "INVALID SEED"  , "The hexseed you provided is incorrect" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
                      }
                  })
                }
            }).catch((error) => {console.log(error)});

        }
    }

    // show Open wallet button when PIN and Hexseed are provided
    openButton = () => {
        if (this.state.pin != null){
            return(
                <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.openWallet}>
                    <Text style={styles.TextStyle}> OPEN WALLET </Text>
                </TouchableOpacity>
            );
        }
        else {
            return(
                <View></View>
            );
        }
    }

    // show/hide the PIN view
    launchModal(bool, pinValue) {
        this.setState({modalVisible: bool, pin: pinValue})
    }

    // update hexseed on successful QR scan
    updateHexseed(e){
        this.setState({hexModalVisible: false, hexseed: e.data})
    }

    // show/hide the PIN view
    launchHexModal(bool) {
        this.setState({hexModalVisible: bool})
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
                <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
                    <View style={{flex:1}}></View>
                    <View style={{flex:1.5, alignItems:'center'}}>
                        <Text style={styles.bigTitle}>OPEN EXISTING WALLET</Text>
                        <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                        <View>
                            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => { this.props.navigation.navigate('OpenExistingWalletWithMnemonic') } } >
                                <Text style={styles.TextStyle}> OPEN WITH MNEMONIC </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => { this.props.navigation.navigate('OpenExistingWalletWithHexseed') } }>
                                <Text style={styles.TextStyle}> OPEN WITH HEXSEED </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.SubmitButtonStyleRed} activeOpacity = { .5 } onPress={ () => this.props.navigation.navigate('SignIn') }>
                                <Text style={styles.TextStyleWhite}> BACK </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        );
    }
}
