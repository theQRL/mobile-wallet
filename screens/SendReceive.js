import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, AsyncStorage, Clipboard, StyleSheet, TouchableHighlight, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert, AppState} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Header } from 'react-navigation';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
var validate = require('@theqrl/validate-qrl-address');
import BackgroundTimer from 'react-native-background-timer';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosTransferCoins = NativeModules.transferCoins;
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;

import QRCode from 'react-native-qrcode';
import QRCodeScanner from 'react-native-qrcode-scanner';
var GLOBALS = require('./globals');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles.js';

export default class SendReceive extends React.Component {

    static navigationOptions = {
        drawerLabel: 'SEND & RECEIVE',
        drawerIcon: ({ tintColor }) => (
            <Image source={require('../resources/images/send_receive_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain}  style={{width:25, height:25}} />
        ),
    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {

        if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // stop the timeout
            const timeoutId = this.state.backgroundTimer;
            BackgroundTimer.clearTimeout(timeoutId);
            // if unlockWithPin OR needPinTimeout is true, then show PIN view
            AsyncStorage.multiGet(["unlockWithPin", "needPinTimeout"]).then(storageResponse => {
                unlockWithPin = storageResponse[0][1];
                needPinTimeout = storageResponse[1][1];
                if (unlockWithPin === 'true' || needPinTimeout === 'true'){
                    // reset needPinTimeout to false
                    AsyncStorage.setItem('needPinTimeout', 'false');
                    // show PIN view
                    this.props.navigation.navigate('UnlockAppModal');
                }
            }).catch((error) => {console.log(error)});
        }
        // if ( nextAppState.match(/inactive|background/) ){
        if ( nextAppState === 'background' ){
            // start timer to check if user left the app for more than 15 seconds
            const timeoutId = BackgroundTimer.setTimeout(() => {
                AsyncStorage.setItem('needPinTimeout', 'true')
            }, 10000);
            // save the timeoutID to the state to check/stop it when app is back to active state
            this.setState({ backgroundTimer: timeoutId });
        }
        this.setState({appState: nextAppState});
    };

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        // Update the wallet each time the user switch to this view
        this.setState({isLoading:true})

        // get the currect walletindex
        AsyncStorage.getItem("walletindex").then((walletindex) => {
            // Ios
            if (Platform.OS === 'ios'){
                // iPhone Plus
                // if (DeviceInfo.getModel().includes("Plus")){
                //     this.setState({paddingTopMain:40, paddingTopCentral: 10, menuHeight:80})
                // }
                // // iPhoneX
                // else {
                //     if (DeviceInfo.getModel().includes("X")){
                //         this.setState({paddingTopMain:70, paddingTopCentral: 10, menuHeight:80})
                //     }
                //     // other iPhones
                //     else {
                //         this.setState({paddingTopMain:15, paddingTopCentral:0, menuHeight:50})
                //     }
                // }
                IosWallet.refreshWallet(walletindex, (error, walletAddress, otsIndex, balance, keys)=> {
                    this.setState({walletAddress: walletAddress, balance: balance/ 1000000000, otsIndex: otsIndex, isLoading:false})
                });
            }
            // Android
            else {
                AndroidWallet.refreshWallet(walletindex, (err) => {console.log(err);}, (walletAddress, otsIndex, balance, keys)=> {
                    this.setState({walletAddress: walletAddress, balance: balance/ 1000000000, otsIndex: otsIndex, isLoading:false})
                });
            }
        }).catch((error) => {console.log(error)});
    }

    state={
        // amount: "10",
        balance: "loading...",
        view: 'send',
        fee: "0.01",
        isLoading: true,
        amount: "",
        showModal: false,
        showOtsModal: false,
        recipient: "",
        appState: AppState.currentState,
    }

    // update recipient
    _onRecipientChange = (text) => {
        this.setState({recipient:text});
    }

    // update amount
    _onAmountChange = (text) => {
        this.setState({amount:text});
    }

    // update amount
    _onOtsChange = (text) => {
        this.setState({newOtsIndex:text});
    }

    // switch view to SEND tab
    switchSend = () => {
        this.setState({view:'send'});
    }

    // swith view to RECEIVE tab
    switchReceive = () => {
        this.setState({view:'receive'});
    }

    // check QRL address validity
    checkAddress = () => {
        if (this.state.recipient == "" || this.state.amount == ""){
            Alert.alert( "MISSING INFORMATION"  , "Please provide a valid QRL address and an amount to transfer" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
        }
        else {
            var isValid = validate.hexString(this.state.recipient).result;
            if (isValid){
                // get the currect walletindex
                AsyncStorage.getItem("walletindex").then((walletindex) => {
                    // iOS
                    if (Platform.OS === 'ios'){
                        // check that there are no pending tx
                        IosWallet.checkPendingTx(walletindex, (error, status)=> {
                            if (status =="success"){
                                // check that amount is a Number
                                var isAmountNumber = /^\d*\.?\d+$/.test(this.state.amount)
                                if (isAmountNumber){

                                    // check the decimals (if there are any)
                                    if (this.state.amount.toString().split(".").length > 1 ){
                                        if (this.state.amount.toString().split(".")[1].length > 8 ){
                                            Alert.alert( "INVALID AMOUNT"  , "The amount you are sending can have up to 8 decimals." , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )    
                                        }
                                        // All good to send the tx
                                        else {
                                            this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})
                                        }
                                    }
                                    else {
                                        this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})
                                    }
                                    
                                }
                                else {
                                    Alert.alert( "INVALID AMOUNT"  , "Enter a correct amount" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
                                }
                            }
                            // wallet has a pending tx
                            else {
                                Alert.alert( "PENDING TRANSACTION IDENTIFIED"  , "You have a pending transaction on the network. Please check your OTS index again as it might need to be adjusted manually." , [{text: "OK", onPress: () => this.props.navigation.navigate('SendReceive') } ] )
                            }
                        });
                    }
                    // Android
                    else {
                        // check that there are no pending tx
                        AndroidWallet.checkPendingTx(walletindex, (error) => {console.log("ERROR")}, (status)=> {
                            if (status =="success"){
                                // check that amount is a Number
                                var isAmountNumber = /^\d*\.?\d+$/.test(this.state.amount)
                                if (isAmountNumber){

                                    // check the decimals (if there are any)
                                    if (this.state.amount.toString().split(".").length > 1 ){
                                        if (this.state.amount.toString().split(".")[1].length > 8 ){
                                            Alert.alert( "INVALID AMOUNT"  , "The amount you are sending can have up to 8 decimals." , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )    
                                        }
                                        // All good to send the tx
                                        else {
                                            this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})    
                                        }
                                    }
                                    else {
                                        this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})    
                                    }
                                    
                                    // this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})    

                                }
                                else {
                                    Alert.alert( "INVALID AMOUNT"  , "Enter a correct amount" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
                                }
                            }
                            // wallet has a pending tx
                            else {
                                Alert.alert( "PENDING TRANSACTION IDENTIFIED"  , "You have a pending transaction on the network. Please check your OTS index again as it might need to be adjusted manually." , [{text: "OK", onPress: () => this.props.navigation.navigate('SendReceive') } ] )
                            }
                        });
                    }
                }).catch((error) => {console.log(error)});
            }
            else {
                Alert.alert( "INVALID ADDRESS"  , "The QRL address you provided as recipient is invalid" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
            }
        }
    }

    // Copy address to clipboard and return visual confirmation
    copyAddress = (address) => {
        Clipboard.setString('Q'+address);
        showMessage({
            message: "Simple message",
            type: "info",
        });
    }


    showModal = (showBool) => {
        this.setState({showModal: showBool})
    }

    qrScanned = (e) => {
        this.setState({showModal: false, recipient: e.data});
    }

    render() {
        if (this.state.isLoading){
            return(<View></View>)
        }

        else {
            // formatting address for UI
            addressBegin = this.state.walletAddress.substring(1, 10);
            addressEnd = this.state.walletAddress.substring(58, 79);
            QrWalletAddress = "Q"+this.state.walletAddress;

            // <KeyboardAvoidingView style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}} behavior="padding">

            // View for iOS
            // if (Platform.OS === 'ios'){
                return (
                    <ScrollView scrollEnabled={false} contentContainerStyle={{flex: 1}} >

                    <Modal onRequestClose={ console.log("") } animationType="fade" visible={this.state.showOtsModal} transparent={true}>
                        <View
                            style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(100,100,100, 0.5)',
                            padding: 20,
                        }}
                        >
                            <View style={{borderRadius: 10, width:wp(85), height:hp(30), backgroundColor:'white',alignItems:'center', alignSelf:'center', justifyContent:'center', top:hp(10), position: 'absolute'}}>
                                <Text style={styles.descriptionTextBlack}>Change OTS key index</Text>
                                <TextInput autoFocus={true} underlineColorAndroid="transparent" keyboardType={'numeric'} onChangeText={ (text) => this._onOtsChange(text) } style={{borderRadius: 10, backgroundColor:'#ebe8e8', height:hp(6), width:wp(65), marginBottom: hp(3)}} />
                                <View>
                                    <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={() => {this.setState({showOtsModal:false})}}>
                                        <Text style={styles.TextStyleWhite}> CANCEL </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.SubmitButtonStyleBlueSmall} activeOpacity = { .5 } onPress={() => {this.setState({otsIndex: this.state.newOtsIndex, showOtsModal:false})}}>
                                        <Text style={styles.TextStyleWhite}> CONFIRM </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    
                    <Modal onRequestClose={ console.log("") } animationType="slide" visible={this.state.showModal}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <QRCodeScanner onRead={this.qrScanned.bind(this)}
                                topContent={
                                    <View style={{flex:1, width: wp(100), backgroundColor: '#16447B'}}>
                                        {Platform.OS === 'ios' ?
                                        <View style={{height: hp(15), marginTop: hp(6) , borderRadius:10, alignSelf:'center'}}>
                                        <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                            <View style={{flex:1, alignSelf:'center', width: wp(96), height: wp(10), justifyContent:'center', alignItems:'center'}}>
                                                <Text style={styles.sectionTitle}>SCAN WALLET QR CODE</Text>
                                            </View>
                                        </ImageBackground>
                                    </View>
                                        :
                                        <View style={{height: hp(15), marginTop: hp(2) , borderRadius:10, alignSelf:'center'}}>
                                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                                <View style={{flex:1, alignSelf:'center', width: wp(96), height: wp(10), justifyContent:'center', alignItems:'center'}}>
                                                    <Text style={styles.sectionTitle}>SCAN WALLET QR CODE</Text>
                                                </View>
                                            </ImageBackground>
                                        </View>
                                    }
                                        
                                    </View>
                                }
                                bottomContent={
                                    <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={() => this.showModal(false)} >
                                        <Text style={styles.TextStyleWhite}> DISMISS </Text>
                                    </TouchableOpacity> 
                                }
                            />
                        </View>
                    </Modal>


                    <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:hp(8), paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
                                <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>
                        <FlashMessage/> 

                        <View style={{ height: hp(20), marginTop: hp(3), borderRadius:10, alignSelf:'center'}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                <View style={{flex:1, alignSelf:'center', width:wp(96), justifyContent:'center', alignItems:'center', padding:10}}>
                                    <Text style={{color:'white', fontWeight: "bold", fontSize:12, textAlign:'center'}} selectable={true}>Q{this.state.walletAddress}</Text>
                                    <Text style={{color:'white',fontSize:30}}>{this.state.balance} QRL</Text>
                                </View>
                            </ImageBackground>
                        </View>


                        {this.state.view == "send"?
                            <KeyboardAvoidingView style={{flex:1, paddingBottom:100, width:wp(93), alignSelf: 'center'}} behavior="padding">
                                <ScrollView style={{flex:1}}>
                                    <View style={{ height:hp(8), backgroundColor:'white', flexDirection:'row', borderTopLeftRadius:10, borderTopRightRadius:10}}>
                                        <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white', borderTopLeftRadius:10}}>
                                            <Text>SEND</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa', borderTopRightRadius:10}}>
                                            <Text>RECEIVE</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{width:'50%',height:1, backgroundColor:'red'}}></View>
                                    
                                    <View style={{height:hp(50), backgroundColor:'white', width:wp(93), padding:30, borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
                                        <Text>RECIPIENT</Text>

                                        <View style={styles.SectionStyle}>
                                            <TextInput underlineColorAndroid="transparent" onChangeText={ (text) => this._onRecipientChange(text) } value={this.state.recipient} style={{backgroundColor:'#ebe8e8', height:hp(6), flex:1, borderRadius: 10}} />
                                            <TouchableOpacity style={styles.SubmitButtonStyle3} activeOpacity = { .5 } onPress={() => this.showModal(true)} >
                                                <Image source={require('../resources/images/scanQrCode.png')} style={styles.ImageStyle}/>
                                            </TouchableOpacity>
                                        </View>


                                        <Text>{'\n'}AMOUNT</Text>
                                        <View style={styles.SectionStyle}>
                                            <TextInput underlineColorAndroid="transparent" keyboardType={'numeric'} onChangeText={ (text) => this._onAmountChange(text) } value={this.state.amount} style={{backgroundColor:'#ebe8e8', height:hp(6), flex:1, borderRadius: 10}} />
                                        </View>
                                        <View style={{flexDirection:'row', paddingTop:10}}>
                                            <View style={{flex:1, alignItems:'flex-start'}}><Text>Fee: <Text style={{color:'red'}}>0.01</Text></Text></View>
                                            <View style={{flex:1, alignItems:'flex-end'}}>
                                                <TouchableHighlight underlayColor={'white'} onPress={() => {this.setState({showOtsModal:true})}}>
                                                    <Text>OTS Key Index: <Text style={{color:'red'}}>{this.state.otsIndex}</Text></Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>

                                        <View style={{alignSelf:'center', marginTop: hp(5)}}>
                                            <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={ this.checkAddress } >
                                                <Text style={styles.TextStyleWhite}> REVIEW AND CONFIRM</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* <TouchableOpacity style={styles.SubmitButtonStyle3} activeOpacity = { .5 } onPress={() => this.showModal(true)} >
                                            <Image source={require('../resources/images/scan.png')} resizeMode={Image.resizeMode.contain} style={{height:80, width:80}} />
                                        </TouchableOpacity> */}
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                            :
                            <View style={{flex:1, paddingBottom:100, width:wp(93), alignSelf: 'center'}}>
                                <View style={{height: hp(8), backgroundColor:'white', flexDirection:'row',  borderTopLeftRadius:10, borderTopRightRadius:10}}>
                                    <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa', borderTopLeftRadius:10}}>
                                        <Text>SEND</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white', borderTopRightRadius:10}}>
                                        <Text>RECEIVE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width:'50%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>

                                <View style={{height:hp(50), backgroundColor:'white', width:wp(93), padding:10, alignItems:'center', borderBottomRightRadius:10, borderBottomLeftRadius:10}}>
                                    <QRCode value={QrWalletAddress} size={hp(20)} bgColor='black' fgColor='white'/>
                                    <Text style={{fontWeight:'bold', paddingTop:30}}>Your public wallet address</Text>
                                    <Text selectable={true} style={styles.smallTextBlack}>Q{this.state.walletAddress}</Text>

                                    <View style={{alignSelf:'center', marginTop: hp(3)}}>
                                    <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 }  onPress={ () => { Clipboard.setString('Q'+this.state.walletAddress);
                                        showMessage({
                                            message: "QRL address copied to clipboard",
                                            type: "info",
                                            backgroundColor: "#EB2E42"
                                        });
                                    }}>
                                        <Text style={styles.TextStyleWhite}> COPY </Text>
                                    </TouchableOpacity>
                                </View>


                                </View>

                                
                               
                            </View>
                        }
                    </ImageBackground>
                    
                    </ScrollView>
                );
            // }
            // // View for Android
            // else {
            //     return (
            //         <KeyboardAvoidingView style={{flex:1}} keyboardVerticalOffset={-200} behavior="padding">


            //             <Modal onRequestClose={ console.log("") } animationType="fade" visible={this.state.showOtsModal} transparent={true}>
            //                 <View style={{flex:1, backgroundColor:'rgba(0, 0, 0, 0.5)', width:'100%', height:'100%'}}>
            //                     <View style={{width:300, height:300, backgroundColor:'white',alignItems:'center', alignSelf:'center', justifyContent:'center', marginTop:200}}>
            //                         <Text>Change OTS key index</Text>
            //                         <TextInput keyboardType={'numeric'} onChangeText={ (text) => this._onOtsChange(text) } style={{backgroundColor:'#ebe8e8', height:50, width:200}} />
            //                         <Button title='Cancel' onPress={() => {this.setState({showOtsModal:false})}}/>
            //                         <Button title='Ok' onPress={() => {this.setState({otsIndex: this.state.newOtsIndex, showOtsModal:false})}}/>
            //                     </View>
            //                 </View>
            //             </Modal>


            //             <Modal onRequestClose={ console.log("") } animationType="slide" visible={this.state.showModal}>
            //                 <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            //                     <QRCodeScanner onRead={this.qrScanned.bind(this)}
            //                         topContent={
            //                             <Text style={styles.centerText}>
            //                                 Scan QRL wallet QR code
            //                             </Text>
            //                         }
            //                         bottomContent={
            //                             <TouchableOpacity onPress={() => this.showModal(false)} >
            //                                 <Text style={styles.CancelTextStyle}>Dismiss</Text>
            //                             </TouchableOpacity>
            //                         }
            //                     />
            //                 </View>
            //             </Modal>

            //             <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
            //                 <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
            //                     <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
            //                     <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
            //                     </TouchableHighlight>
            //                 </View>
            //                 <FlashMessage/> 

            //                 <View style={{ alignItems:'center', paddingTop:20}}>
            //                     <ImageBackground source={require('../resources/images/backup_bg.png')} resizeMode={Image.resizeMode.contain} style={{height:120, width:330, justifyContent:'center',alignItems:'center', padding:10}} >
            //                         <Text style={{color:'white', fontWeight: "bold", fontSize:12, textAlign:'center'}} selectable={true}>Q{this.state.walletAddress}</Text>
            //                         <Text style={{color:'white',fontSize:30}}>{this.state.balance} QRL</Text>
            //                     </ImageBackground>
            //                     {/* <TouchableOpacity style={styles.SubmitButtonStyle2} activeOpacity = { .5 } onPress={ this.refreshWallet }>
            //                         <Image source={require("../resources/images/refresh.png")} style={{height:40, width:40}}/>
            //                     </TouchableOpacity> */}
            //                 </View>

            //                 {this.state.view == "send"?
            //                     <View style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}} >
            //                         <View style={{height:50, backgroundColor:'white', flexDirection:'row'}}>
            //                             <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
            //                                 <Text>SEND</Text>
            //                             </TouchableOpacity>
            //                             <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
            //                                 <Text>RECEIVE</Text>
            //                             </TouchableOpacity>
            //                         </View>
            //                         <View style={{width:'50%',height:1, backgroundColor:'red'}}></View>
            //                         <View style={{height: 290, backgroundColor:'white', width:330, padding:30}}>
            //                             <Text>RECIPIENT</Text>
            //                             <TextInput onChangeText={ (text) => this._onRecipientChange(text) } underlineColorAndroid="transparent" value={this.state.recipient} style={{backgroundColor:'#ebe8e8', height:40}} />
            //                             <Text>{'\n'}AMOUNT</Text>
            //                             <TextInput keyboardType={'numeric'} underlineColorAndroid="transparent" onChangeText={ (text) => this._onAmountChange(text) } value={this.state.amount} style={{backgroundColor:'#ebe8e8', height:40}} />
            //                             <View style={{flexDirection:'row', paddingTop:10}}>
            //                                 <View style={{flex:1, alignItems:'flex-start'}}><Text>Fee: <Text style={{color:'red'}}>0.01</Text></Text></View>
            //                                 <View style={{flex:1, alignItems:'flex-end'}}>
            //                                     <TouchableHighlight underlayColor={'white'} onPress={() => {this.setState({showOtsModal:true})}}>
            //                                         <Text>OTS Key Index: <Text style={{color:'red'}}>{this.state.otsIndex}</Text></Text>
            //                                     </TouchableHighlight>
            //                                 </View>

            //                             </View>

            //                             <TouchableOpacity style={styles.SubmitButtonStyleBig} activeOpacity = { .5 } onPress={ this.checkAddress }>
            //                                 <Text style={styles.TextStyle}> REVIEW AND CONFIRM </Text>
            //                             </TouchableOpacity>
            //                         </View>

            //                         <View style={{flex:0.1}}>
            //                             <TouchableOpacity style={styles.SubmitButtonStyle3} activeOpacity = { .5 } onPress={() => this.showModal(true)} >
            //                                 <Image source={require('../resources/images/scan.png')} resizeMode={Image.resizeMode.contain} style={{height:70, width:70}} />
            //                             </TouchableOpacity>
            //                         </View>
            //                     </View>
            //                     :
            //                     <View style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}}>
            //                         <View style={{height:50, backgroundColor:'white', flexDirection:'row'}}>

            //                             <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
            //                                 <Text>SEND</Text>
            //                             </TouchableOpacity>
            //                             <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
            //                                 <Text>RECEIVE</Text>
            //                             </TouchableOpacity>
            //                         </View>
            //                         <View style={{width:'50%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
            //                         <View style={{height:300, backgroundColor:'white', width:330, padding:30, alignItems:'center'}}>
            //                             <QRCode value={QrWalletAddress} size={150} bgColor='black' fgColor='white'/>
            //                             <Text style={{fontWeight:'bold', paddingTop:30}}>Your public wallet address</Text>
            //                             <Text selectable={true}>Q{this.state.walletAddress}</Text>
            //                         </View>
            //                         <View>
            //                             {/* <TouchableOpacity style={styles.SubmitButtonStyleCopy} activeOpacity = { .5 } onPress={ Clipboard.setString('Q'+this.state.walletAddress) } > */}
                                        
            //                             <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => { Clipboard.setString('Q'+this.state.walletAddress);
            //                                 showMessage({
            //                                     message: "QRL address copied to clipboard",
            //                                     backgroundColor: "#EB2E42"
            //                                 });
            //                             }}>
            //                                 <Text style={styles.TextStyle}> COPY </Text>
            //                             </TouchableOpacity>
            //                         </View>
            //                     </View>
            //                 }
            //             </ImageBackground>
            //         </KeyboardAvoidingView>
            //     );
            // }
        }
    }
}
