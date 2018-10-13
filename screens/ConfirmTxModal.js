import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity,ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';
var validate = require('@theqrl/validate-qrl-address');
// Android and Ios native modules
import {NativeModules} from 'react-native';
// ios
var IosTransferCoins = NativeModules.transferCoins;
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;

export default class ConfirmTxModal extends React.Component {


    state={
        isLoading:false
    }

    // transfer coins
    transferCoins = () => {
        this.setState({isLoading:true})
        // Ios
        if (Platform.OS === 'ios'){
            // recheck the otsIndex in case
            IosWallet.refreshWallet((error, walletAddress, otsIndex, balance, keys)=> {
                amountShor = this.props.navigation.state.params.amount * 1000000000
                feeShor = this.props.navigation.state.params.fee * 1000000000
                IosTransferCoins.sendCoins(this.props.navigation.state.params.recipient, amountShor, otsIndex, feeShor , (error, status)=> {
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
    }


    render() {
      return(
          <ImageBackground source={require('../resources/images/confirmTxModal_bg.png')} style={styles.backgroundImage}>
              <View style={{height:130, width:330, flex: 1, alignSelf: 'center', justifyContent:'center', paddingTop:160}}>
                  <ImageBackground source={require('../resources/images/confirmTxModal_window.png')} style={{width:null, height:"85%", flex:1}} >
                      <View style={{alignSelf:'center', paddingTop: 40, alignItems:'center'}}>
                          <Image source={require('../resources/images/confirmTxModal_check.png')} resizeMode={Image.resizeMode.contain} style={{height:75, width:75, marginBottom:15}} />
                          <Text style={{color:'white'}}>PLEASE CONFIRM</Text>
                          <Text style={{color:'white'}}>YOUR TRANSACTION</Text>
                      </View>
                      <View style={{alignSelf:'center', alignItems:'center', margin:30}}>
                          <Text style={{color:'gray'}}>YOU ARE SENDING</Text>
                          <Text style={{color:'black', fontSize:40}}>{this.props.navigation.state.params.amount} <Text style={{color:'gray', fontSize:12}}>QRL </Text></Text>
                          <Text style={{color:'gray'}}>TO THE FOLLOWING ADDRESS</Text>
                          <Text style={{color:'black', fontSize:20}}>{this.props.navigation.state.params.recipient} </Text>
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
                              <Button onPress={() => this.props.navigation.navigate("SendReceive")} title="Cancel" color='red' />
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
        // remove width and height to override fixed static size
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
    TextStyle:{
        color:'#fff',
        textAlign:'center',
    },
});
