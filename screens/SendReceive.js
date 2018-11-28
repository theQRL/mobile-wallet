import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, AsyncStorage, Clipboard, StyleSheet, TouchableHighlight, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Header } from 'react-navigation';
var validate = require('@theqrl/validate-qrl-address');

// Android and Ios native modules
import {NativeModules} from 'react-native';
// ios
var IosTransferCoins = NativeModules.transferCoins;
import QRCode from 'react-native-qrcode';
import QRCodeScanner from 'react-native-qrcode-scanner';

// ios
var IosWallet = NativeModules.refreshWallet;
// android
var AndroidWallet = NativeModules.AndroidWallet;

var GLOBALS = require('./globals');

export default class SendReceive extends React.Component {
  static navigationOptions = {
    drawerLabel: 'SEND & RECEIVE',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../resources/images/send_receive_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain}  style={{width:25, height:25}}
      />
    ),
  };



  componentDidMount() {

      const recipient = this.props.navigation.getParam('recipient', 'norecipient');
      if (recipient == "norecipient"){
          // this.setState({recipient:""})
          this.setState({recipient: GLOBALS.recipient })
      }
      else {
          this.setState({recipient:recipient})
      }

      // Update the wallet each time the user switch to this view
      this.setState({isLoading:true})

      // get the currect walletindex
      AsyncStorage.getItem("walletindex").then((walletindex) => {

          // Ios
          if (Platform.OS === 'ios'){
              // iPhone Plus
              if (DeviceInfo.getModel().includes("Plus")){
                  this.setState({paddingTopMain:40, paddingTopCentral: 10, menuHeight:80})
              }
              // iPhoneX
              else {
                  if (DeviceInfo.getModel().includes("X")){
                      this.setState({paddingTopMain:70, paddingTopCentral: 10, menuHeight:80})
                  }
                  // other iPhones
                  else {
                      this.setState({paddingTopMain:15, paddingTopCentral:0, menuHeight:50})
                  }
              }
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
      fee: "0.001",
      isLoading: true
  }


    _onRecipientChange = (text) => {
        this.setState({recipient:text});
    }
    _onAmountChange = (text) => {
        this.setState({amount:text});
    }

    switchSend = () => {
        this.setState({view:'send'});
    }
    switchReceive = () => {
        this.setState({view:'receive'});
    }


    checkAddress = () => {

        if (this.state.recipient == "" || this.state.amount == ""){
            Alert.alert( "MISSING INFORMATION"  , "Please provide a valid QRL address and an amount to transfer" , [{text: "OK", onPress: () => console.log('OK Pressed')} ] )
        }
        else {
            var isValid = validate.hexString(this.state.recipient).result;
            if (isValid){
                // get the currect walletindex
                AsyncStorage.getItem("walletindex").then((walletindex) => {
                    if (Platform.OS === 'ios'){
                        // check that there are no pending tx
                        IosWallet.checkPendingTx(walletindex, (error, status)=> {
                            if (status =="success"){
                                // check that amount is a Number
                                var isAmountNumber = /^\d*\.?\d+$/.test(this.state.amount)
                                if (isAmountNumber){
                                    this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})
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

                    else {
                        // check that there are no pending tx
                        AndroidWallet.checkPendingTx(walletindex, (error) => {console.log("ERROR")}, (status)=> {
                            if (status =="success"){
                                // check that amount is a Number
                                var isAmountNumber = /^\d*\.?\d+$/.test(this.state.amount)
                                if (isAmountNumber){
                                    this.props.navigation.navigate('ConfirmTxModal',{amount: this.state.amount, recipient: this.state.recipient, otsIndex: this.state.otsIndex, fee: this.state.fee})
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

  render() {

      if (this.state.isLoading){
          return(<View></View>)
      }

      else {
          addressBegin = this.state.walletAddress.substring(1, 10);
          addressEnd = this.state.walletAddress.substring(58, 79);

          // View for iOS
          if (DeviceInfo.getDeviceId().includes("iPhone10")){
              return (
                  <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} activeOpacity={1}>
                              <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>

                        <View style={{ alignItems:'center', paddingTop:this.state.paddingTopMain }}>
                            <ImageBackground source={require('../resources/images/fund_bg_small.png')} resizeMode={Image.resizeMode.contain} style={{height:100, width:330, justifyContent:'center',alignItems:'center'}} >
                            <Text style={{color:'white'}}>QRL BALANCE</Text>
                            <Text style={{color:'white', fontWeight: "bold"}}>Q{addressBegin}...{addressEnd}</Text>
                            <Text style={{color:'white',fontSize:30}}>{this.state.balance}</Text>
                            </ImageBackground>
                            <TouchableOpacity style={styles.SubmitButtonStyle2} activeOpacity = { .5 } onPress={ this.refreshWallet }>
                                <Image source={require("../resources/images/refresh.png")} style={{height:40, width:40}}/>
                            </TouchableOpacity>
                        </View>

                        {this.state.view == "send"?

                            <KeyboardAvoidingView style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}} behavior="padding">
                                <ScrollView style={{flex:1}}>
                                    <View style={{ height:this.state.menuHeight, backgroundColor:'white', flexDirection:'row'}}>
                                        <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                                            <Text>SEND</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                                            <Text>RECEIVE</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{width:'50%',height:1, backgroundColor:'red'}}></View>

                                    <View style={{height:300, backgroundColor:'white', width:330, padding:30}}>
                                        <Text>RECIPIENT</Text>
                                        <TextInput onChangeText={ (text) => this._onRecipientChange(text) } value={this.state.recipient} style={{backgroundColor:'#ebe8e8', height:50}} />
                                        <Text>{'\n'}AMOUNT</Text>
                                        <TextInput keyboardType={'numeric'} onChangeText={ (text) => this._onAmountChange(text) } value={this.state.amount} style={{backgroundColor:'#ebe8e8', height:50}} />
                                        <View style={{flexDirection:'row', paddingTop:10}}>
                                            <View style={{flex:1, alignItems:'flex-start'}}><Text>Fee: <Text style={{color:'red'}}>0.001</Text></Text></View>
                                            <View style={{flex:1, alignItems:'flex-end'}}><Text>OTS Key Index: <Text style={{color:'red'}}>{this.state.otsIndex}</Text></Text></View>
                                        </View>

                                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.checkAddress } >
                                            <Text style={styles.TextStyle}> REVIEW </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.SubmitButtonStyle3} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('ScanQrModal')} >
                                            <Image source={require('../resources/images/scan.png')} resizeMode={Image.resizeMode.contain} style={{height:80, width:80}} />
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                            :
                            <View style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}}>
                                <View style={{height:this.state.menuHeight, backgroundColor:'white', flexDirection:'row'}}>

                                    <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                                        <Text>SEND</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                                        <Text>RECEIVE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width:'50%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                                <View style={{height:300, backgroundColor:'white', width:330, padding:30, alignItems:'center'}}>
                                    <QRCode value={this.state.walletAddress} size={150} bgColor='black' fgColor='white'/>
                                    <Text style={{fontWeight:'bold', paddingTop:30}}>Your public wallet address</Text>
                                    <Text>Q{this.state.walletAddress}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ Clipboard.setString('Q'+this.state.walletAddress) } >
                                        <Text style={styles.TextStyle}> COPY </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                </ImageBackground>
              );
          }
          // View for Android
          else {
              return (
                  <KeyboardAvoidingView style={{flex:1}} keyboardVerticalOffset={-200} behavior="padding">
                      <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='white'>
                              <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>

                            <View style={{ alignItems:'center', paddingTop:20}}>
                                <ImageBackground source={require('../resources/images/fund_bg_small.png')} resizeMode={Image.resizeMode.contain} style={{height:100, width:330, justifyContent:'center',alignItems:'center'}} >
                                <Text style={{color:'white'}}>QRL BALANCE</Text>
                                <Text style={{color:'white',fontSize:30}}>{this.state.balance}</Text>
                                </ImageBackground>
                                <TouchableOpacity style={styles.SubmitButtonStyle2} activeOpacity = { .5 } onPress={ this.refreshWallet }>
                                    <Image source={require("../resources/images/refresh.png")} style={{height:40, width:40}}/>
                                </TouchableOpacity>
                            </View>

                        {this.state.view == "send"?
                            <View style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}} >
                                <View style={{height:50, backgroundColor:'white', flexDirection:'row'}}>
                                    <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                                        <Text>SEND</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                                        <Text>RECEIVE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width:'50%',height:1, backgroundColor:'red'}}></View>
                                <View style={{height: 290, backgroundColor:'white', width:330, padding:30}}>
                                    <Text>RECIPIENT</Text>
                                    <TextInput onChangeText={ (text) => this._onRecipientChange(text) } underlineColorAndroid="transparent" value={this.state.recipient} style={{backgroundColor:'#ebe8e8', height:40}} />
                                    <Text>{'\n'}AMOUNT</Text>
                                    <TextInput keyboardType={'numeric'} underlineColorAndroid="transparent" onChangeText={ (text) => this._onAmountChange(text) } value={this.state.amount} style={{backgroundColor:'#ebe8e8', height:40}} />
                                    <View style={{flexDirection:'row', paddingTop:10}}>
                                        <View style={{flex:1, alignItems:'flex-start'}}><Text>Fee: <Text style={{color:'red'}}>0.001</Text></Text></View>
                                        <View style={{flex:1, alignItems:'flex-end'}}><Text>OTS Key Index: <Text style={{color:'red'}}>{this.state.otsIndex}</Text></Text></View>
                                    </View>

                                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.checkAddress }>
                                        <Text style={styles.TextStyle}> REVIEW </Text>
                                    </TouchableOpacity>
                                </View>

                            <View style={{flex:0.1}}>
                                <TouchableOpacity style={styles.SubmitButtonStyle3} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('ScanQrModal')} >
                                    <Image source={require('../resources/images/scan.png')} resizeMode={Image.resizeMode.contain} style={{height:70, width:70}} />
                                </TouchableOpacity>
                            </View>
                        </View>
                            :
                            <View style={{flex:1, paddingTop: this.state.paddingTopCentral, paddingBottom:100, width:330, alignSelf: 'center', borderRadius:10}}>
                                <View style={{height:50, backgroundColor:'white', flexDirection:'row'}}>

                                    <TouchableOpacity onPress={ this.switchSend } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                                        <Text>SEND</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={ this.switchReceive } style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
                                        <Text>RECEIVE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{width:'50%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                                <View style={{height:300, backgroundColor:'white', width:330, padding:30, alignItems:'center'}}>
                                    <QRCode value={this.state.walletAddress} size={150} bgColor='black' fgColor='white'/>
                                    <Text style={{fontWeight:'bold', paddingTop:30}}>Your public wallet address</Text>
                                    <Text>Q{this.state.walletAddress}</Text>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.SubmitButtonStyleCopy} activeOpacity = { .5 } onPress={ Clipboard.setString('Q'+this.state.walletAddress) } >
                                        <Text style={styles.TextStyle}> COPY </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </ImageBackground>
                </KeyboardAvoidingView>
              );
          }
      }


  }
}


const styles = StyleSheet.create({
    SubmitButtonStyle: {
        alignSelf:'flex-end',
        width: 150,
        marginTop:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#f33160',
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyleCopy: {
        alignSelf:'flex-end',
        width: 150,
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#f33160',
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyle3: {
        flex:1,
        alignSelf:'center',
        paddingTop:15,
        paddingBottom:85,
    },
    SubmitButtonStyle2: {
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        top:-15,
        left: -1,
    },
    TextStyle:{
        color:'#fff',
        textAlign:'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    }
});
