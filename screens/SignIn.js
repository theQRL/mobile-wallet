import React, { Component } from 'react';
import {Platform,StyleSheet,ImageBackground,Text,View,TouchableOpacity,Dimensions} from 'react-native';

export default class SignIn extends React.Component {

    render() {
        console.log("GETTING DIMENSION INFORMATION....");
        console.log("WIDTH:", Dimensions.get('window').width);
        console.log("HEIGHT:", Dimensions.get('window').height);

        // check if user can close the new wallet process
        // true if the user already has a wallet open and asking to open a new wallet 
        const closable = this.props.navigation.getParam('closable', false);
        
        return (
            <ImageBackground source={require('../resources/images/signin_process_bg.png')} style={styles.backgroundImage}>
                <View style={{flex:1}}></View>
                <View style={{flex:1, alignItems:'center'}}>
                    <Text>WELCOME</Text>
                    <Text style={styles.bigTitle}>LOGIN / CREATE</Text>
                        <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('CompleteSetup',{treeHeight: 10, signatureCounts: "1024",  hashFunctionName: "SHAKE_128", hashFunctionId:1 }) }>
                        <Text style={styles.TextStyle}> CREATE DEFAULT WALLET </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('CreateWalletTreeHeight',{treeHeight: 10, signatureCounts: "1024",  hashFunctionName: "SHAKE_128", hashFunctionId:1 }) }>
                        <Text style={styles.TextStyle}> CREATE ADVANCED WALLET </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => this.props.navigation.push('OpenExistingWallet') }>
                        <Text style={styles.TextStyle}> OPEN EXISTING WALLET </Text>
                    </TouchableOpacity>

                    {closable?
                        <TouchableOpacity style={styles.SubmitButtonStyleRed} activeOpacity = { .5 } onPress={ () => this.props.navigation.navigate('CreateNewWallet') }>
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

// styling
const styles = StyleSheet.create({
    bigTitle:{
        color:'white',
        fontSize: 25,
    },
    SubmitButtonStyle: {
        width: 300,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'white',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyleRed: {
        width: 300,
        marginTop:10,
        paddingTop:10,
        paddingBottom:10,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#D72E61',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#D72E61'
    },
    TextStyle:{
        color:'#1e79cb',
        textAlign:'center',
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
});
