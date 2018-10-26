import React, { Component } from 'react';
import {Platform, StyleSheet, ImageBackground, Text, View, Image, ActionSheetIOS, TextInput, Modal, Button, ActivityIndicator, Picker, AsyncStorage, TouchableOpacity, TouchableHighlight } from 'react-native';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;

export default class CompleteSetup extends React.Component {

  static navigationOptions = {
      headerMode: 'none'
  };

  state={
      hashFunction: '',
      loading: false,
      dimensions : undefined,
      y1:0,
      y2:0,
      y3:0,
      showModal: false,
      selectText : undefined
  }

  // Create QRL wallet
    createWallet = () => {
        this.setState({loading:true})
        // Ios
        if (Platform.OS === 'ios'){
            IosWallet.createWallet(this.props.navigation.state.params.treeHeight, this.props.navigation.state.params.hashFunctionId,  (err, status)=> {
                this.setState({loading:false})
                // if success -> open the main view of the app
                if (status =="success"){
                    AsyncStorage.setItem("walletcreated","yes");
                    this.props.navigation.navigate('App');
                }
                else {
                    console.log("ERROR while opening wallet: ")
                }
            })
        }
        // Android
        else {
          AndroidWallet.createWallet(this.props.navigation.state.params.treeHeight, this.props.navigation.state.params.hashFunctionId, (err) => {console.log(err); }, (status) => {
              // if success -> open the main view of the app
              if (status =="success"){
                  AsyncStorage.setItem("walletcreated","yes");
                  this.props.navigation.navigate('App');
              }
              else {
                  console.log("ERROR while opening wallet: ", error)
              }
          })
        }
    }

    render() {
        return (
          <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>

              <View style={{flex:1}}>
              </View>
              <View style={{flex:1, alignItems:'center'}} ref='Marker2' onLayout={({nativeEvent}) => { this.refs.Marker2.measure((x, y, width, height, pageX, pageY) => {this.setState({y1:y});}) }}>
                  <Text style={styles.bigTitle}>COMPLETE SETUP</Text>
                  <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                  <Text style={{color:'white'}}>{'\n'}Height: {this.props.navigation.state.params.treeHeight}</Text>
                  <Text style={{color:'white'}}>Signatures: {this.props.navigation.state.params.signatureCounts}</Text>
                  <Text style={{color:'white'}}>Hash function: {this.props.navigation.state.params.hashFunctionName}</Text>

                  <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.createWallet} >
                      <Text style={styles.TextStyle}> CREATE WALLET </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={ () => {this.props.navigation.popToTop()} }>
                    <Text style={styles.TextStyleWhite}> START AGAIN </Text>
                  </TouchableOpacity>

                  {this.state.loading ? <View style={{alignItems:'center'}}><ActivityIndicator style={{paddingTop:20}} size={'large'}></ActivityIndicator><Text style={{color:'white'}}>This may take a while.</Text><Text style={{color:'white'}}>Please be patient...</Text></View> : undefined}

              </View>
          </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    bigTitle:{
        color:'white',
        fontSize: 25,
    },
    SubmitButtonStyle: {
        width: 300,
        height:50,
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'white',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyleDark: {
        width: 300,
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#144b82',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#144b82'
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
