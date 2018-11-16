import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, StyleSheet,AsyncStorage, TouchableHighlight, TouchableOpacity,ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';
var validate = require('@theqrl/validate-qrl-address');
// Android and Ios native modules
import DeviceInfo from 'react-native-device-info';
import {NativeModules} from 'react-native';
// ios
var IosTransferCoins = NativeModules.transferCoins;
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;

export default class ConfirmTxModal extends React.Component {


    static navigationOptions = {
         drawerLabel: () => null
    };

    componentDidMount() {
        // Ios
        if (Platform.OS === 'ios'){
            // iPhone Plus
            if (DeviceInfo.getModel().includes("Plus")){
                    this.setState({paddingTop:100, paddingTopBelow: 20})
            }
            // iPhoneX
            else {
                if (DeviceInfo.getModel().includes("X")){
                    this.setState({paddingTop:160, paddingTopBelow: 40})
                }
                // other iPhones
                else {
                    this.setState({paddingTop:100, paddingTopBelow: 20})
                }
            }
        }
        // Android
        else {
            this.setState({paddingTop:100, paddingTopBelow: 10})
        }
    }


    state={
        isLoading:false
    }

    // transfer coins
    transferCoins = () => {
        this.setState({isLoading:true})


        // get the currect walletindex
        AsyncStorage.getItem("walletindex").then((walletindex) => {
            // Ios
            if (Platform.OS === 'ios'){
                // recheck the otsIndex in case
                IosWallet.refreshWallet(walletindex, (error, walletAddress, otsIndex, balance, keys)=> {
                    amountShor = this.props.navigation.state.params.amount * 1000000000
                    feeShor = this.props.navigation.state.params.fee * 1000000000
                    IosTransferCoins.sendCoins(this.props.navigation.state.params.recipient, amountShor, otsIndex, feeShor, walletindex, (error, status)=> {
                        // if tx is successfull, back to main
                        if (status == "success"){
                            this.props.navigation.navigate("TransactionsHistory")
                        }
                        else {
                            Alert.alert( "ERROR"  , "Something went wrong. Please try again." , [{text: "OK", onPress: () => this.props.navigation.navigate("SendReceive") } ] )
                        }
                    });
                });
            }
            // Android
            else {
                AndroidWallet.refreshWallet( (err) => {console.log(err);}, (walletAddress, otsIndex, balance, keys)=> {

                    amountShor = this.props.navigation.state.params.amount
                    feeShor = this.props.navigation.state.params.fee * 1000000000

                    AndroidWallet.transferCoins( this.props.navigation.state.params.recipient, parseInt(amountShor), otsIndex, feeShor,  (err) => {console.log(err)}, (status) => {
                        // if tx is successfull, back to main
                        if (status == "success"){
                            this.props.navigation.navigate("TransactionsHistory")
                        }
                        else {
                            Alert.alert( "ERROR"  , "Something went wrong. Please try again." , [{text: "OK", onPress: () => this.props.navigation.navigate("SendReceive") } ] )
                        }
                    });
                });

            }
        }).catch((error) => {console.log(error)});

    }

    render() {
      return(
          <ImageBackground source={require('../resources/images/confirmTxModal_bg.png')} style={styles.backgroundImage}>
              <View style={{height:130, width:330, flex: 1, alignSelf: 'center', justifyContent:'center', paddingTop:this.state.paddingTop}}>
                  <ImageBackground source={require('../resources/images/confirmTxModal_window.png')} style={{width:null, height:"85%", flex:1}} >
                      <View style={{alignSelf:'center', paddingTop: this.state.paddingTopBelow, alignItems:'center'}}>
                          <Image source={require('../resources/images/confirmTxModal_check.png')} resizeMode={Image.resizeMode.contain} style={{height:75, width:75, marginBottom:15}} />
                          <Text style={{color:'white'}}>PLEASE CONFIRM</Text>
                          <Text style={{color:'white'}}>YOUR TRANSACTION</Text>
                      </View>
                      <View style={{alignSelf:'center', alignItems:'center', margin:30}}>
                          <Text style={{color:'gray'}}>YOU ARE SENDING</Text>
                          <Text style={{color:'black', fontSize:40}}>{this.props.navigation.state.params.amount} <Text style={{color:'gray', fontSize:12}}>QRL </Text></Text>
                          <Text style={{color:'gray'}}>TO THE FOLLOWING ADDRESS</Text>
                          <Text style={{color:'black', fontSize:18}}>{this.props.navigation.state.params.recipient} </Text>
                      </View>
                      {this.state.isLoading ?
                          <View>
                            <ActivityIndicator size={'large'}></ActivityIndicator>
                          </View>
                          :
                          <View>
                              <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.transferCoins } >
                                  <Text style={styles.TextStyle}>CONFIRM AND SEND</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate("SendReceive")} >
                                  <Text style={styles.CancelTextStyle}>Cancel</Text>
                              </TouchableOpacity>
                          </View>
                      }
                  </ImageBackground>
              </View>
          </ImageBackground>
      )
    }

}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        paddingTop: 100,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    SubmitButtonStyle: {
        alignSelf:'center',
        width: 180,
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#f33160',
        borderWidth: 1,
        borderColor: '#fff'
    },
    CancelTextStyle:{
        alignSelf:'center',
        color: 'red',
        textAlign:'center',
        fontSize:18,
        paddingTop:5
    },
    TextStyle:{
        color:'#fff',
        textAlign:'center',
    },
});
