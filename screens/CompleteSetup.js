import React, { Component } from 'react';
import {Platform, StyleSheet, ImageBackground, Text, View, Image, ActionSheetIOS, TextInput, Modal, Button, ActivityIndicator, Picker, AsyncStorage, TouchableOpacity, TouchableHighlight } from 'react-native';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import PINCode from '@haskkor/react-native-pincode'
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
      selectText : undefined,
      modalVisible: false,
      disableButton: false
  }

  // update the wallet counter
  _updateWalletcounter = (walletcounterUpdate) => {
      AsyncStorage.setItem("walletcounter", walletcounterUpdate);
  }


  _updateWalletIndex = (walletIndexToCreate, address) => {
      AsyncStorage.setItem("walletcreated","yes");
      // update the walletindex
      AsyncStorage.setItem("walletindex",walletIndexToCreate );
      // update the walletlist JSON
      // if first wallet create, just instantiate the walletlist JSON
      if (walletIndexToCreate == "1"){
          AsyncStorage.setItem("walletlist", JSON.stringify( [{"index":walletIndexToCreate, "address": "Q"+address}] ) );
      }
      else {
          // update walletlist JSON
          AsyncStorage.getItem("walletlist").then((walletlist) => {
              walletlist = JSON.parse(walletlist)
              walletlist.push({"index":walletIndexToCreate, "address": "Q"+address})
              AsyncStorage.setItem("walletlist", JSON.stringify( walletlist ));
          });
      }
      // show main menu once wallet is open
      this.props.navigation.navigate('App');
  }



  openPinView = () => {
      console.log("OPENING PIN");
      // this.props.navigation.navigate('ProvideWalletPin', {treeHeight: this.props.navigation.state.params.treeHeight, signatureCounts: this.props.navigation.state.params.signatureCounts, hashFunctionId:this.props.navigation.state.params.hashFunctionId,  hashFunctionName: this.props.navigation.state.params.hashFunctionName});
  }


  // Create QRL wallet
    createWallet = () => {
        this.setState({loading:true, disableButton:true})

        AsyncStorage.getItem('walletcounter').then((walletcounter) => {
            // if not first wallet
            if(walletcounter != null){
                walletIndexToCreate = (parseInt(walletcounter, 10) + 1).toString();
                this._updateWalletcounter(walletIndexToCreate)
            }
            // if first wallet
            else {
                walletIndexToCreate = "1"
                this._updateWalletcounter("1");
            }

            // Ios
            if (Platform.OS === 'ios'){
                IosWallet.createWallet(this.props.navigation.state.params.treeHeight, walletIndexToCreate, this.state.pin, this.props.navigation.state.params.hashFunctionId,  (err, status, address)=> {
                    this.setState({loading:false})
                    // if success -> open the main view of the app
                    if (status =="success"){
                        this._updateWalletIndex(walletIndexToCreate, address)
                    }
                    else {
                        console.log("ERROR while opening wallet: ")
                    }
                })
            }
            // Android
            else {
              AndroidWallet.createWallet(this.props.navigation.state.params.treeHeight, walletIndexToCreate, this.props.navigation.state.params.hashFunctionId, (err) => {console.log(err); }, (status, address) => {
                  // if success -> open the main view of the app
                  if (status =="success"){
                      this._updateWalletIndex(walletIndexToCreate, address)
                  }
                  else {
                      console.log("ERROR while opening wallet: ", error)
                  }
              })
            }
        }).catch((error) => {console.log(error)});
    }


    launchModal(bool, pinValue) {
        console.log("PIN IS", pinValue)
        this.setState({modalVisible: bool, pin: pinValue})
    }

    render() {

        return (
          <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>

              <Modal animationType="slide" visible={this.state.modalVisible}>

                    <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>
                        <PINCode
                          status={'choose'}

                          storePin={(pin: string) => {
                              this.setState({pin:pin})
                          }}

                          bottomLeftComponent = {
                              <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                  <TouchableHighlight onPress={() => this.launchModal(false, null) } >
                                      <Text style={{color:'white'}}>Cancel</Text>
                                  </TouchableHighlight>
                              </View>
                          }
                          subtitleChoose = "to keep your QRL wallet secure"
                          stylePinCodeColorSubtitle ="white"
                          stylePinCodeColorTitle="white"
                          colorPassword="white"
                          numbersButtonOverlayColor="white"
                          finishProcess = {() => this.launchModal(false, this.state.pin) }
                        />
                        </ImageBackground>
                </Modal>




              <View style={{flex:1}}>
              </View>
              <View style={{flex:1, alignItems:'center'}} ref='Marker2' onLayout={({nativeEvent}) => { this.refs.Marker2.measure((x, y, width, height, pageX, pageY) => {this.setState({y1:y});}) }}>
                  <Text style={styles.bigTitle}>COMPLETE SETUP</Text>
                  <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                  <Text style={{color:'white'}}>{'\n'}Height: {this.props.navigation.state.params.treeHeight}</Text>
                  <Text style={{color:'white'}}>Signatures: {this.props.navigation.state.params.signatureCounts}</Text>
                  <Text style={{color:'white'}}>Hash function: {this.props.navigation.state.params.hashFunctionName}</Text>

                  {this.state.pin != null ?
                      <TouchableOpacity style={styles.SubmitButtonStyle} disabled={this.state.disableButton} activeOpacity = { .5 } onPress={this.createWallet} >
                          <Text style={styles.TextStyle}> CREATE WALLET </Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={styles.SubmitButtonStyle} disabled={this.state.disableButton} activeOpacity = { .5 } onPress={ () => {this.launchModal(true, null)}}  >
                          <Text style={styles.TextStyle}> ADD PIN </Text>
                      </TouchableOpacity>
                  }

                  <TouchableOpacity style={styles.SubmitButtonStyleDark} disabled={this.state.disableButton} activeOpacity = { .5 } onPress={ () => {this.props.navigation.popToTop()} }>
                    <Text style={styles.TextStyleWhite}> START AGAIN </Text>
                  </TouchableOpacity>

                  {this.state.loading ?

                      <View style={{alignItems:'center'}}><ActivityIndicator style={{paddingTop:20}} size={'large'}></ActivityIndicator><Text style={{color:'white'}}>This may take a while.</Text><Text style={{color:'white'}}>Please be patient...</Text></View>
                    :
                        undefined
                  }

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
