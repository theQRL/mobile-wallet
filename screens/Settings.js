import React from 'react';
import {Text, View, TextInput, Image, ImageBackground, AsyncStorage, StyleSheet, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator, Modal, BackHandler, AppState, Switch, ScrollView} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import BackgroundTimer from 'react-native-background-timer';
// let isDefaultNode = 'true';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles.js';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

export default class Settings extends React.Component {

    componentWillMount() {
        console.log(wp(50) )
        console.log(hp)
        AppState.addEventListener('change', this._handleAppStateChange);
        AsyncStorage.getItem("unlockWithPin").then((unlockWithPin) => {
            // console.log("WALLETPIN IN SETTINGS IS ", unlockWithPin)
            if (unlockWithPin === 'false'){
                this.setState({switchValue: false})    
            }
            else {
                this.setState({switchValue: true})
            }
        }).catch((error) => {console.log(error)});
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        AsyncStorage.multiGet(["nodeUrl", "nodePort"]).then(storageResponse => {
            this.setState({nodeUrl: storageResponse[0][1], nodePort: storageResponse[1][1], loading: false});    
        });

    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton() {
        return true;
    }

    _handleAppStateChange = (nextAppState) => {

        if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // stop the timeout
            const timeoutId = this.state.backgroundTimer;
            BackgroundTimer.clearTimeout(timeoutId);
            // if unlockWithPin OR needPinTimeout is true, then show PIN view
            AsyncStorage.multiGet(["unlockWithPin", "needPinTimeout"]).then(storageResponse => {
                unlockWithPin = storageResponse[0][1];
                needPinTimeout = storageResponse[1][1];
                if (unlockWithPin === 'true' || needPinTimeout === 'true'){
                    // reset needPinTimeout to false
                    AsyncStorage.setItem('needPinTimeout', 'false');
                    // show PIN view
                    this.props.navigation.navigate('UnlockAppModal');
                }
            }).catch((error) => {console.log(error)});
        }
        // if ( nextAppState.match(/inactive|background/) ){
        if ( nextAppState === 'background' ){
            // start timer to check if user left the app for more than 15 seconds
            const timeoutId = BackgroundTimer.setTimeout(() => {
                AsyncStorage.setItem('needPinTimeout', 'true')
            }, 10000);
            // save the timeoutID to the state to check/stop it when app is back to active state
            this.setState({ backgroundTimer: timeoutId });
        }
        this.setState({appState: nextAppState});
    };


    static navigationOptions = ({navigation}) => ({
        // AsyncStorage.multiGet(["nodeUrl", "nodePort"]).then(storageResponse => {
            drawerLabel: (
            <View style={{flex:1, height:50, flexDirection: 'row', justifyContent:'center', paddingLeft: 15 }}>
                <View style={{flex:1, justifyContent:'center'}}><Text style={{color:'white', fontSize:wp(3.3), fontWeight:'bold'}}>SETTINGS</Text></View>
                <View style={{flex:1, alignItems:'flex-end', justifyContent:'center', paddingRight:10}}>
                    { global.isDefaultNode ? 
                    null
                    :
                    // <Text>{global.isDefaultNode}</Text>
                    <Image source={require('../resources/images/warning_icon.png')} resizeMode={'contain'} style={{width:20, height:20}}/>
                    }
                </View>
            </View>
            ),
            drawerIcon: ({ tintColor }) => (
                <Image source={require('../resources/images/icon_settings.png')} resizeMode={'contain'} style={{width:25, height:25}}/>
            ),
        // })
    })


    state={
        loading: true,
        appState: AppState.currentState,
    }


    onUrlChange = (text) => {
        this.setState({nodeUrl: text})
    }

    onPortChange = (text) => {
        this.setState({nodePort: text})
    }

    // update the node and port information on AsyncStorage as well as Android and iOS native code
    saveSettings = () => {
        console.log("")
        if (Platform.OS === 'ios'){
            IosWallet.saveNodeInformation( this.state.nodeUrl, this.state.nodePort, (error, status)=> {
                if (status == "saved"){
                    // Alert SUCCESS
                  AsyncStorage.setItem("nodeUrl", this.state.nodeUrl);
                  AsyncStorage.setItem("nodePort", this.state.nodePort);

                if (this.state.nodeUrl != 'mainnet-3.automated.theqrl.org'){
                    global.isDefaultNode = false;
                }
                else {
                    global.isDefaultNode = true;
                }
                this.props.navigation.setParams({otherParam: 'Updated!'})
                }
            });    
        }
        else {
            AndroidWallet.saveNodeInformation(this.state.nodeUrl, this.state.nodePort,  (err) => {console.log(err);}, (status)=> {
                if (status == "saved"){
                    // Alert SUCCESS
                  AsyncStorage.setItem("nodeUrl", this.state.nodeUrl);
                  AsyncStorage.setItem("nodePort", this.state.nodePort);
                }
                if (this.state.nodeUrl != 'mainnet-3.automated.theqrl.org'){
                    global.isDefaultNode = false;
                }
                else {
                    global.isDefaultNode = true;
                }
                this.props.navigation.setParams({otherParam: 'Updated!'})
            });
        }
    }

    // toggle PIN required on/off
    toggleSwitch = (value) => {
        this.setState({switchValue: value})
        if (value){
            AsyncStorage.setItem('unlockWithPin', 'true');
        }
        else {
            AsyncStorage.setItem('unlockWithPin', 'false');
        }
        
     }

    // render view
    render() {
        if (this.state.loading){
            return(
                <View></View>
            )
        }
        else {
            return (
                <View style={{flex:1}}>
                <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>                

                    <View style={{flex:1}}>
                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:hp(4), paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477' style={{paddingBottom:20, paddingRight: 30, paddingTop: 20}}>
                            <Image source={require('../resources/images/sandwich.png')} resizeMode={'contain'} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>
                        {/* <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:hp(8), paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
                                <Image source={require('../resources/images/sandwich.png')} resizeMode={'contain'} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View> */}
                        <FlashMessage/> 

                    <ScrollView style={{flex:1, marginBottom:30}}>
                        <View style={{height: hp(20), marginTop: hp(1) , borderRadius:10, alignSelf:'center'}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                <View style={{flex:1, alignSelf:'center', width: wp(96), justifyContent:'center', alignItems:'center'}}>
                                    <Text style={styles.sectionTitle}>SETTINGS</Text>
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={{ width:wp(93), height:hp(45), paddingBottom:100, alignSelf:'center',  borderRadius:10, backgroundColor:'white', padding: 30}}>

                            <View style={{height:hp(5)}}>
                                <Text style={styles.descriptionTextBlack}>Warning: Change the information below at your own risk! </Text>
                            </View>

                            <View style={{height: hp(10)}}>
                                <Text style={{paddingTop: wp(7)}}>NODE URL</Text>
                                <View style={styles.SectionStyle}>
                                    <TextInput underlineColorAndroid="transparent" onChangeText={ (text) => this.onUrlChange(text) } value={this.state.nodeUrl} style={{backgroundColor:'#ebe8e8', height:hp(6), flex:1, borderRadius: 10, paddingLeft: 10}} />
                                </View>

                                <Text>{'\n'}PORT</Text>
                                <View style={styles.SectionStyle}>
                                    <TextInput underlineColorAndroid="transparent" onChangeText={ (text) => this.onPortChange(text)  } value={this.state.nodePort} style={{backgroundColor:'#ebe8e8', height:hp(6), flex:1, borderRadius: 10, paddingLeft: 10}} />
                                </View>
                            </View>

                            <View style={{alignItems: 'center', marginTop: hp(15), height:hp(24)}}>
                                <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 }  onPress={ () => {  this.saveSettings();
                                    showMessage({
                                        message: "Server settings updated",
                                        type: "info",
                                        backgroundColor: "#EB2E42"
                                    });
                                }}>
                                    <Text style={styles.TextStyleWhite}> SAVE </Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={{ width:wp(93), height:60, alignSelf:'center', justifyContent:'center',  borderRadius:10, backgroundColor:'white', paddingLeft: 30, paddingRight: 30, marginTop: 20}}>
                            <View style={{ flexDirection: 'row', justifyContent:'center', height:50 }}>
                                <View style={{flex:1, justifyContent:'center'}}>
                                    <Text>Lock app with PIN</Text>
                                </View>
                                <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                                <Switch
                                    onValueChange = {this.toggleSwitch}
                                    value = {this.state.switchValue}/>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    </View>
                    
                </ImageBackground>
                </View>
            );
        }
    }
}
