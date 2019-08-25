import React, { Component } from 'react';
import {Platform, StyleSheet, ImageBackground, Text, View, Image, ActionSheetIOS, TextInput, Button, ActivityIndicator, Picker, AsyncStorage, TouchableOpacity, Alert, Modal, TouchableHighlight, KeyboardAvoidingView} from 'react-native';
import styles from './styles.js';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;

var GLOBALS = require('./globals');
import PINCode from '@haskkor/react-native-pincode'
import QRCodeScanner from 'react-native-qrcode-scanner';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class OpenExistingWalletWithHexseed extends React.Component {

    // componentDidMount(){
    //     const hexseed = this.props.navigation.getParam('hexseed', 'nohexseed');
    //     if (hexseed == "nohexseed"){
    //         // this.setState({hexseed: "" })
    //         this.setState({ hexseed: GLOBALS.hexseed2 })
    //     }
    //     else {
    //         this.setState({hexseed: hexseed})
    //     }
    // }

    state={
        hexseed: '',
        isLoading: false,
        pin: null,
        modalVisible:false,
        hexModalVisible: false,
        name: ''
    }

    // udpate hexseed
    _onHexSeedChange = (text) => {
        this.setState({hexseed:text});
    }

    _onNameChange = (text) => {
        this.setState({name: text})
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
            AsyncStorage.setItem("walletlist", JSON.stringify( [{"index":walletIndexToCreate, "address": "Q"+address, "name": this.state.name}] ) );
        }
        else {
            // update walletlist JSON
            AsyncStorage.getItem("walletlist").then((walletlist) => {
                walletlist = JSON.parse(walletlist)
                walletlist.push({"index":walletIndexToCreate, "address": "Q"+address, "name": this.state.name})
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
                    IosWallet.openWalletWithHexseed(this.state.hexseed, walletIndexToCreate, this.state.name, this.state.pin, (error, status, address)=> {
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
                  AndroidWallet.openWalletWithHexseed(this.state.hexseed, walletIndexToCreate, this.state.name, this.state.pin, (err) => {console.log(err); } , (status, address)=> {
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
        if (this.state.pin != null && this.state.name != ''){
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
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{flex:1}} enabled>

                <Modal onRequestClose={ console.log("") } animationType="slide" visible={this.state.modalVisible}>
                    <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>
                        <PINCode
                            status={'choose'}
                            storePin={(pin: string) => {
                                this.setState({pin:pin})
                            }}
                            bottomLeftComponent = {
                                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                    <TouchableHighlight onPress={() => this.launchModal(false, null) } >
                                        <Text style={{color:'white'}}>Cancel</Text>
                                    </TouchableHighlight>
                                </View>
                            }
                            subtitleChoose = "to keep your QRL wallet secure"
                            stylePinCodeColorSubtitle ="white"
                            stylePinCodeColorTitle="white"
                            colorPassword="white"
                            numbersButtonOverlayColor="white"
                            finishProcess = {() => this.launchModal(false, this.state.pin) }
                        />
                    </ImageBackground>
                </Modal>

                <Modal onRequestClose={ console.log("") } animationType="slide" visible={this.state.hexModalVisible}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <QRCodeScanner 
                            onRead={ this.updateHexseed.bind(this) }
                            topContent={
                                <View style={{flex:1, width: wp(100), backgroundColor: '#16447B'}}>
                                    {Platform.OS === 'ios' ?
                                        <View style={{height: hp(15), marginTop: hp(6) , borderRadius:10, alignSelf:'center'}}>
                                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                                <View style={{flex:1, alignSelf:'center', width: wp(96), height: wp(10), justifyContent:'center', alignItems:'center'}}>
                                                    <Text style={styles.sectionTitle}>SCAN HEXSEED QR CODE</Text>
                                                </View>
                                            </ImageBackground>
                                        </View>
                                    :
                                        <View style={{height: hp(15), marginTop: hp(2) , borderRadius:10, alignSelf:'center'}}>
                                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                                <View style={{flex:1, alignSelf:'center', width: wp(96), height: wp(10), justifyContent:'center', alignItems:'center'}}>
                                                    <Text style={styles.sectionTitle}>SCAN HEXSEED QR CODE</Text>
                                                </View>
                                            </ImageBackground>
                                        </View>
                                    }
                                </View>
                            }
                            bottomContent={
                                <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={() => this.launchHexModal(false) }>
                                    <Text style={styles.TextStyleWhite}> DISMISS </Text>
                                </TouchableOpacity> 
                            }
                        />
                    </View>
                </Modal>

                <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
                    <View style={{flex:1}}></View>
                    <View style={{flex:4, alignItems:'center'}}>
                        <Text style={styles.bigTitle}>OPEN EXISTING WALLET</Text>
                        <Text style={styles.bigTitle}>WITH HEXSEED</Text>
                        <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>

                        {this.state.isLoading ?
                            <View style={{alignSelf:'center', paddingTop:10}}>
                                <ActivityIndicator size={'large'}></ActivityIndicator>
                                <Text style={{color:'white'}}>This may take a while.</Text>
                                <Text style={{color:'white'}}>Please be patient...</Text>
                            </View>
                            :
                            <View style={{alignItems:'center'}}>
                                <Text style={styles.smallTitle}>1. Enter your hexseed below</Text>

                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',backgroundColor: '#ebe8e8',height: hp(6),borderRadius: 10,width: wp(85), marginTop: 15}}>
                                    <TextInput underlineColorAndroid="transparent" onChangeText={ (text) => this._onHexSeedChange(text) } value={this.state.hexseed} style={{backgroundColor:'#ebe8e8', height:hp(6),width: wp(85), flex:1, borderRadius: 10}} />
                                    <TouchableOpacity style={styles.SubmitButtonStyle3} activeOpacity = { .5 } onPress={() => this.launchHexModal(true)} >
                                        <Image source={require('../resources/images/scanQrCode.png')} style={styles.ImageStyle}/>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.smallTitle}>2. Choose a 4-digit PIN </Text>
                                <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => {this.launchModal(true, null)} }>
                                    <Text style={styles.TextStyle}> CREATE 4-DIGIT PIN </Text>
                                </TouchableOpacity>
                                <Text style={styles.smallTitle}>3. Give your wallet a name</Text>
                                <TextInput onChangeText={ (text) => this._onNameChange(text) } editable={!this.state.isLoading}  underlineColorAndroid="transparent" style={styles.hexInput} value={this.state.name} />
                                <TouchableOpacity style={styles.SubmitButtonStyleRed} activeOpacity = { .5 } onPress={ () => this.props.navigation.navigate('OpenExistingWalletOptions') }>
                                    <Text style={styles.TextStyleWhite}> BACK </Text>
                                </TouchableOpacity>
                                {this.openButton()}
                            </View>
                        }
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        );
    }
}
