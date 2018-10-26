import React from 'react';
import {Platform, Text, View, Button, Image, StyleSheet, ImageBackground, TouchableOpacity, TouchableHighlight, AsyncStorage} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;

export default class CreateNewWallet extends React.Component {
  static navigationOptions = {
    drawerLabel: 'CREATE NEW WALLET',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../resources/images/wallet_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}
      />
    ),
  };

  state={
      mnemonic: '',
      hexseed: '',
      loading: false
  }

  // Get wallet private info
  closeWallet = () => {
      // Ios
      this.setState({loading: true});
      if (Platform.OS === 'ios'){
          IosWallet.closeWallet((error, status)=> {
              if (status == "success") {
                  // remove the walletCreate item from asyncStorage and redirect to main wallet creation page
                  this.props.navigation.navigate( 'Auth');
                  AsyncStorage.removeItem("walletcreated");
              }
          });
      }
      // Android
      else {
          AndroidWallet.sendWalletPrivateInfo((error) => {console.log("ERROR");} , (mnemonic, hexseed)=> {
              this.setState({loading:false, mnemonic: mnemonic, hexseed: hexseed })
          });
      }
  }

  // render view
  render() {
      return (
          <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
            <View style={{flex:1}}>

                <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                    <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='white'>
                      <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                    </TouchableHighlight>
                </View>
                <View style={{ height:130, width:330, borderRadius:10, alignSelf:'center', marginTop: 30}}>
                    <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage2}>
                        <View style={{flex:1, alignSelf:'center', width:330, justifyContent:'center', alignItems:'center'}}>
                            <Text style={{color:'white', fontSize:20}}>OPEN NEW WALLET</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={{flex:1, paddingTop: 50, paddingBottom:100, width:330, alignSelf: 'center',  borderRadius:10}}>
                    <View style={{height:50, backgroundColor:'white'}}>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                            <Text>New wallet creation</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                    <View style={{flex:2, backgroundColor:'white', width:330, padding:30, alignItems:'center'}}>
                        <View>
                            <Text>You are about to create a new wallet and close the existing one.</Text>
                            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.closeWallet }>
                                <Text style={styles.TextStyle}> CREATE </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
      );
  }

}


const styles = StyleSheet.create({
    SubmitButtonStyle: {
        alignSelf:'center',
        width: 150,
        marginTop:30,
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
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    backgroundImage2: {
        alignSelf: 'flex-start',
        left: 0
    },


});
