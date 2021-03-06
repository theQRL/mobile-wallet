import React, { Component } from 'react';
import { Platform, StyleSheet, TouchableOpacity, ImageBackground, BackHandler, Text, View, Button, AsyncStorage, TouchableHighlight} from 'react-native';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import PINCode from '@haskkor/react-native-pincode'
var GLOBALS = require('./globals');

export default class UnlockAppModal extends React.Component {

    static navigationOptions = {
        drawerLabel: () => null
    };

    // get the wallet PIN code from keychain
    componentWillMount(){
        AsyncStorage.getItem("walletindex").then((walletindex) => {
            if (Platform.OS === 'ios'){
                IosWallet.getWalletPin(walletindex, (err, walletpin)=> {
                    this.setState({isLoading:false, walletpin: walletpin })
                });
            }
            // android
            else {
                AndroidWallet.getWalletPin(walletindex, (err) => {console.log(err); }, (walletpin) => {
                    this.setState({isLoading:false, walletpin: walletpin })
                })
            }
        })
    }

    state={
        isLoading: false
    }

    // open QRL wallet
    unlockApp = () => {
        this.setState({isLoading: true})
        // this.props.navigation.state.params.onGoBack();
        // this.props.navigation.navigate("TransactionsHistory");
        this.props.navigation.goBack();
    }

    exitButton() {
        return(
            <TouchableOpacity><Text></Text></TouchableOpacity>
        )
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
                            {/* <TouchableHighlight onPress={() => this.props.navigation.goBack()  } >
                                <Text style={{color:'white'}}>Cancel</Text>
                            </TouchableHighlight> */}
                        </View>
                    }
                    stylePinCodeColorSubtitle ="white"
                    subtitleEnter = "to unlock your wallet"
                    stylePinCodeColorTitle="white"
                    colorPassword="white"
                    numbersButtonOverlayColor="white"
                    finishProcess = { this.unlockApp }
                    buttonComponentLockedPage = {this.exitButton}
                    />
                </ImageBackground>
            );
        }
    }
}

// styling
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
        paddingTop:10,
        paddingBottom:10,
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
