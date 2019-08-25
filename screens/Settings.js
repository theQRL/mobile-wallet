import React from 'react';
import {Text, View, TextInput, Image, ImageBackground, AsyncStorage, StyleSheet, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator, Modal, AppState, Switch} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import BackgroundTimer from 'react-native-background-timer';
let isDefaultNode = 'true';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles.js';

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
        // AsyncStorage.multiGet(["nodeUrl", "nodePort"]).then(storageResponse => {
        //     console.log("............................. SETTINGS *******************************")
        //     // get at each store's key/value so you can work with it
        //     let nodeUrl = storageResponse[0][1];
        //     let nodePort = storageResponse[1][1]; 
        //     if (nodeUrl != 'testnet-4.automated.theqrl.org'){
                
        //         isDefaultNode = 'false';
        //     }
        // });
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
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


    // static navigationOptions = ({ navigation }) => {
    //     const { state } = navigation;
    //     console.log("............................................................")
    //     console.log(navigation)
    //     return {
    //         drawerLabel: (
    //             <View style={{flex:1, height:50, flexDirection: 'row', justifyContent:'center', paddingLeft: 15 }}>
    //                 <View style={{flex:1, justifyContent:'center'}}><Text style={{color:'white', fontSize:14, fontWeight:'bold'}}>SETTINGS</Text></View>
    //                 <View style={{flex:1, alignItems:'flex-end', justifyContent:'center', paddingRight:10}}>
    //                     {state.params.defaultNode ? 
    //                         null
    //                     : 
    //                         <Image source={require('../resources/images/warning_icon.png')} resizeMode={Image.resizeMode.contain} style={{width:20, height:20}}/>
    //                     }
                        
    //                 </View>
    //             </View>
    //         ),
    //         drawerIcon: ({ tintColor }) => (
    //             <Image source={require('../resources/images/icon_settings.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}/>
    //         ),
    //     }
    // };

    componentDidMount(){
        AsyncStorage.multiGet(["nodeUrl", "nodePort"]).then(storageResponse => {
            this.setState({nodeUrl: storageResponse[0][1], nodePort: storageResponse[1][1], loading: false});    
        });

    }

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

                if (this.state.nodeUrl != 'testnet-4.automated.theqrl.org'){
                    global.isDefaultNode = false;
                }
                else {
                    global.isDefaultNode = true;
                }
                this.props.navigation.setParams({otherParam: 'Updated!'})
                console.log("SETTINGSJS2_ GLOBALS.ISDEFAULTNODE: ", global.isDefaultNode)

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
                <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>                

                    <View style={{flex:1}}>
                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:hp(8), paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
                                <Image source={require('../resources/images/sandwich.png')} resizeMode={'contain'} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>

                        <View style={{height: hp(20), marginTop: hp(3) , borderRadius:10, alignSelf:'center'}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                <View style={{flex:1, alignSelf:'center', width: wp(96), justifyContent:'center', alignItems:'center'}}>
                                    <Text style={styles.sectionTitle}>SETTINGS</Text>
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={{ width:wp(93), height:hp(60), paddingBottom:100, alignSelf:'center',  borderRadius:10, backgroundColor:'white', padding: 30}}>
                            <Text style={styles.descriptionTextBlack}>Warning: Change the information below at your own risk! </Text>

                            <Text style={{paddingTop: wp(7)}}>NODE URL</Text>
                            <View style={styles.SectionStyle}>
                                <TextInput underlineColorAndroid="transparent" onChangeText={ (text) => this.onUrlChange(text) } value={this.state.nodeUrl} style={{backgroundColor:'#ebe8e8', height:hp(6), flex:1, borderRadius: 10}} />
                            </View>

                            <Text>{'\n'}PORT</Text>
                            <View style={styles.SectionStyle}>
                                <TextInput underlineColorAndroid="transparent" onChangeText={ (text) => this.onPortChange(text)  } value={this.state.nodePort} style={{backgroundColor:'#ebe8e8', height:hp(6), flex:1, borderRadius: 10}} />
                            </View>

                            <View style={{alignItems: 'center', marginTop: hp(4)}}>
                                <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={ () => { this.saveSettings() }}>
                                    <Text style={styles.TextStyleWhite}> SAVE </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{width:'100%',height:1, backgroundColor:'lightgray', alignSelf:'flex-end', marginTop: 10}}></View>
                            <View style={{ flexDirection: 'row', justifyContent:'center', height:70 }}>
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
                    </View>

                </ImageBackground>
            );
        }
    }
}
