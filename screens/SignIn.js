import React, { Component } from 'react';
import {StyleSheet,ImageBackground,Text,View,TouchableOpacity} from 'react-native';
import styles from './styles.js';

export default class SignIn extends React.Component {

    render() {
        // check if user can close the new wallet process
        // true if the user already has a wallet open and asking to open a new wallet 
        const closable = this.props.navigation.getParam('closable', false);
        
        return (
            <ImageBackground testID="SignIn" source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
                <View style={{flex:1}} ></View>
                <View style={{flex:2, alignItems:'center'}}>
                    <Text style={styles.bigTitleBlack}>WELCOME</Text>
                    <Text style={styles.bigTitle}>LOGIN / CREATE</Text>
                    <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                    
                    <TouchableOpacity testID="createDefaultWalletButton" style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('CompleteSetup',{treeHeight: 10, signatureCounts: "1024",  hashFunctionName: "SHAKE_128", hashFunctionId:1 }) }>
                        <Text style={styles.TextStyle}> CREATE DEFAULT WALLET </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity testID="createAdvancedWalletButton" style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('CreateWalletTreeHeight',{treeHeight: 10, signatureCounts: "1024",  hashFunctionName: "SHAKE_128", hashFunctionId:1 }) }>
                        <Text style={styles.TextStyle}> CREATE ADVANCED WALLET </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity testID="openExistingWalletButton" style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => this.props.navigation.push('OpenExistingWalletOptions') }>
                        <Text style={styles.TextStyle}> OPEN EXISTING WALLET </Text>
                    </TouchableOpacity>

                    {closable?
                        <TouchableOpacity style={styles.SubmitButtonStyleRed} activeOpacity = { .5 } onPress={ () => this.props.navigation.navigate('Wallets') }>
                            <Text style={styles.TextStyleWhite}> CANCEL </Text>
                        </TouchableOpacity>
                    :
                        undefined
                    }
                </View>
            </ImageBackground>
        );
    }
}
