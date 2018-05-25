/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ActionSheetIOS,
  TextInput,
  Button,
  Picker,
  TouchableOpacity
} from 'react-native';



// for crypto
import './shim.js'
import crypto from 'crypto'

// Android and Ios native modules
import {NativeModules} from 'react-native';
// ios
var CreateWallet = NativeModules.CreateWallet;
// android
var HelloWorld = NativeModules.HelloWorld;



export default class App extends Component<{}> {

    state={
        address: '',
        passphrase : '',
        treeHeight: "",
        hashFunction: ''
    }


    // ANDROID
    async helloWorld() {
        try {
            let helloWorldStr = await HelloWorld.helloWorld();
            console.log(helloWorldStr);
        } catch (e) {
            console.error(e);
        }
    }

    // IOS
    createWallet = () => {

        const randomBytes = crypto.randomBytes(48)
        console.log(randomBytes)

        // CreateWallet.createWallet("YEAHHHH")
        CreateWallet.createWallet(randomBytes, this.state.hashFunction,(error, pk)=> {
            console.log("REACTNATIVE :wallet address is :",pk)
            this.setState({address:pk})
        })
    }




    showActionSheet(){

        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel','Height:8, Signatures:256', 'Height:10, Signatures:1.024','Height:12, Signatures:4,096','Height:14, Signatures:16,384','Height:16, Signatures:65,536','Height:18, Signatures:262,144'],
            cancelButtonIndex: 0,
        },
        (buttonIndex) => {
            if (buttonIndex === 1) { /* destructive action */ }
        });
    }


    render() {
        // this.helloWorld();
        return (
          <View style={styles.container}>

           <Image source={require('./resources/images/qrl.logo.circle.500x500.png')} resizeMode={Image.resizeMode.contain} style={{height:250, width:250}} />
            <Text style={styles.welcome}>
              Welcome to the QRL
            </Text>


            <Text style={styles.welcome} onPress={this.showActionSheet}>
                Three height
            </Text>

            <TextInput style={{height: 40, width:200}} placeholder="Passphrase" onChangeText={(text) => this.setState({passphrase:text})}/>

        <View style={{ flex:1}} >
            <Picker selectedValue={this.state.treeHeight} style={{ height: 30, width: 300 }} onValueChange={(itemValue, itemIndex) => this.setState({treeHeight: itemValue})}>
                <Picker.Item label="Tree Height:8, Signatures:256" value="8" />
                <Picker.Item label="Tree Height:10, Signatures:1,024" value="10" />
                <Picker.Item label="Tree Height:12, Signatures:4,096" value="12" />
                <Picker.Item label="Tree Height:14, Signatures:16,384" value="14" />
                <Picker.Item label="Tree Height:16, Signatures:65,536" value="16" />
                <Picker.Item label="Tree Height:18, Signatures:262,144" value="18" />
            </Picker>
        </View>

            <View style={{ flex:1}} >
            <Picker selectedValue={this.state.hashFunction} style={{ height: 30, width: 300 }} onValueChange={(itemValue, itemIndex) => this.setState({hashFunction: itemValue})}>
                <Picker.Item label="Hash Function: SHAKE_128" value="shake128" />
                <Picker.Item label="Hash Function: SHAKE_256" value="shake256" />
                <Picker.Item label="Hash Function: SHA2_256" value="sha2_256" />
            </Picker>
        </View>



        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.helloWorld }>
            <Text style={styles.TextStyle}> Create wallet Android </Text>
        </TouchableOpacity>

            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.createWallet }>
                <Text style={styles.TextStyle}> Create wallet </Text>
            </TouchableOpacity>

            <Text>{this.state.address}</Text>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  SubmitButtonStyle: {
      width: 200,
      marginTop:10,
      paddingTop:15,
      paddingBottom:15,
      marginLeft:30,
      marginRight:30,
      backgroundColor:'#398cfb',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff'
  },
  TextStyle:{
    color:'#fff',
    textAlign:'center',
  }
});
