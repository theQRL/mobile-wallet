import React from 'react';
import {Text, View, Button, Image, ImageBackground, AsyncStorage, StyleSheet, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;

export default class BackupWallet extends React.Component {

    static navigationOptions = {
        drawerLabel: 'BACK UP YOUR WALLET',
        drawerIcon: ({ tintColor }) => (
            <Image source={require('../resources/images/backup_wallet_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}/>
        ),
    };

    state={
        mnemonic: '',
        hexseed: '',
        loading: false
    }

    // Get wallet private info
    getInfo = () => {
        this.setState({loading: true});
        // get the currect walletindex
        AsyncStorage.getItem("walletindex").then((walletindex) => {
            // iOS
            if (Platform.OS === 'ios'){
                IosWallet.sendWalletPrivateInfo(walletindex, (error, mnemonic, hexseed)=> {
                    this.setState({loading:false, mnemonic: mnemonic, hexseed: hexseed })
                });
            }
            // Android
            else {
                AndroidWallet.sendWalletPrivateInfo(walletindex, (error) => {console.log("ERROR");} , (mnemonic, hexseed)=> {
                    this.setState({loading:false, mnemonic: mnemonic, hexseed: hexseed })
                });
            }
        }).catch((error) => {console.log(error)});
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
                            <Text style={{color:'white', fontSize:20}}>BACK UP YOUR WALLET</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={{flex:1, paddingTop: 50, paddingBottom:100, width:330, alignSelf: 'center',  borderRadius:10}}>
                    <View style={{height:50, backgroundColor:'white'}}>
                        <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                            <Text>View Recovery Seed</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                    <View style={{flex:2, backgroundColor:'white', width:330, padding:30, alignItems:'center'}}>
                        {this.state.mnemonic != '' ?
                            <View>
                                <Text style={{fontWeight: "bold"}}>MNEMONIC</Text>
                                <Text>{this.state.mnemonic}</Text>
                                <Text style={{fontWeight: "bold"}}>{'\n'}HEXSEED</Text>
                                <Text>{this.state.hexseed}</Text>
                            </View>
                            :
                            <View>
                                <Text>Warning: Keep this information private at all times! </Text>
                                <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.getInfo }>
                                    <Text style={styles.TextStyle}> VIEW </Text>
                                </TouchableOpacity>
                            </View>
                        }
                        {this.state.loading ? <View style={{paddingTop:20}}><ActivityIndicator size={'large'}></ActivityIndicator></View>: <View></View>}
                    </View>
                </View>
            </View>
        </ImageBackground>
        );
    }
}

// styling
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
