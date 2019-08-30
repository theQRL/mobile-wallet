import React, { Component } from 'react';
import { Platform, StyleSheet, ImageBackground, Text, View, AsyncStorage, TouchableHighlight} from 'react-native';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
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
            IosWallet.getWalletPin(this.props.navigation.state.params.walletIndexToOpen, (err, walletpin)=> {
                this.setState({isLoading:false, walletpin: walletpin })
            });
        }
        // android
        else {
            AndroidWallet.getWalletPin(this.props.navigation.state.params.walletIndexToOpen, (err) => {console.log(err); }, (walletpin) => {
                this.setState({isLoading:false, walletpin: walletpin })
            })
        }
    }

    state={
        isLoading: false
    }

    // open QRL wallet
    openWallet = () => {
        this.setState({isLoading: true})
        AsyncStorage.setItem("walletindex", this.props.navigation.state.params.walletIndexToOpen );
        this.props.navigation.state.params.onGoBack();
        this.props.navigation.goBack();
        this.props.navigation.navigate("TransactionsHistory");
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
