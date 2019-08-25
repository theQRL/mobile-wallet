import React from 'react';
import {Text, View, Image, ImageBackground, AsyncStorage, StyleSheet, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator, ScrollView, Modal, AppState} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import BackgroundTimer from 'react-native-background-timer';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles.js';

export default class BackupWallet extends React.Component {

    static navigationOptions = {
        drawerLabel: 'BACK UP YOUR WALLET',
        drawerIcon: ({ tintColor }) => (
            <Image source={require('../resources/images/backup_wallet_drawer_icon_light.png')} resizeMode={'contain'} style={{width:25, height:25}}/>
        ),
    };


    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
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

    state={
        mnemonic: '',
        hexseed: '',
        loading: false,
        showModal: false,
        appState: AppState.currentState,
    }

    // show modal to select tree height
    showModal = (bool) => {
        this.setState({showModal: bool})
    }

    // Get wallet private info
    getInfo = () => {
        this.setState({showModal:false, loading: true});
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


    showLoading = () => {
        if (!this.state.loading){
            return(
                <View>
                    <Text style={styles.descriptionTextBlack}>Warning: Keep this information private at all times! </Text>
                    <TouchableOpacity style={styles.SubmitButtonStyleRed} activeOpacity = { .5 } onPress={ () => {this.showModal(true)} }>
                        <Text style={styles.TextStyleWhite}> VIEW </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        else {
            return(
                <View style={{paddingTop:20}}><ActivityIndicator size={'large'}></ActivityIndicator></View>
            );
        }
    }

    // render view
    render() {
        return (
            <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>


                <Modal onRequestClose={ () => {console.log("")}  } visible={this.state.showModal} transparent={true}>
                <View
                    style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(100,100,100, 0.5)',
                    padding: 20,
                    }}
                >
                    <View style={{borderRadius:10, alignItems:'center', alignSelf:'center', justifyContent:'center',backgroundColor:'white', top:200, width: wp(85), height:300, position:'absolute'}}>
                        <Text style={styles.bigTitleBlack}>WARNING</Text>
                        <Text style={styles.descriptionTextBlack}>Keep this information private at all times!</Text>
                        <View>
                            <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={ () => {this.showModal(false)} }>
                                <Text style={styles.TextStyleWhite}> CANCEL </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.SubmitButtonStyleBlueSmall} activeOpacity = { .5 } onPress={this.getInfo}>
                                <Text style={styles.TextStyleWhite}> SHOW </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </Modal>
                
            <View style={{flex:1}}>

                <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:hp(8), paddingLeft:30}}>
                    <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
                        <Image source={require('../resources/images/sandwich.png')} resizeMode={'contain'} style={{height:25, width:25}} />
                    </TouchableHighlight>
                </View>

                <View style={{ height: hp(20), marginTop: hp(3),  borderRadius:10, alignSelf:'center'}}>
                    <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                        <View style={{flex:1, alignSelf:'center', width:wp(96), justifyContent:'center', alignItems:'center'}}>
                            <Text style={styles.sectionTitle}>BACK UP YOUR WALLET</Text>
                        </View>
                    </ImageBackground>
                </View>
                
                <View style={{ width:wp(93), height:hp(70), paddingBottom:100, alignSelf: 'center'}}>
                    <View style={{ height: hp(7), backgroundColor:'white',  alignItems:'center', justifyContent: 'center', borderTopRightRadius:10, borderTopLeftRadius: 10 }}>
                        <Text style={styles.bigTitleBlack}>View Recovery Seed</Text>    
                    </View>
                    <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                    <View style={{ backgroundColor:'white', width:wp(93), padding:30, alignItems:'center', borderBottomRightRadius:10, borderBottomLeftRadius: 10}}>
                        {this.state.mnemonic != '' ?
                            <ScrollView>
                                <Text style={{fontWeight: "bold"}}>MNEMONIC</Text>
                                <Text selectable={true} style={styles.TextStyleBlack}>{this.state.mnemonic}</Text>
                                <Text style={{fontWeight: "bold"}}>{'\n'}HEXSEED</Text>
                                <Text selectable={true} style={styles.TextStyleBlack}>{this.state.hexseed}</Text>
                            </ScrollView>
                            :
                            <View>
                                {this.showLoading()}
                            </View>
                        }
                    </View>
                </View>
            </View>
        </ImageBackground>
        );
    }
}

// // styling
// const styles = StyleSheet.create({
//     SubmitButtonStyle: {
//         alignSelf:'center',
//         width: 150,
//         marginTop:30,
//         paddingTop:15,
//         paddingBottom:15,
//         backgroundColor:'#f33160',
//         borderWidth: 1,
//         borderColor: '#fff'
//     },
//     SubmitButtonStyleSmall: {
//         alignSelf:'center',
//         width: 130,
//         marginTop:30,
//         paddingTop:15,
//         paddingBottom:15,
//         backgroundColor:'#f33160',
//         borderWidth: 1,
//         borderColor: '#fff',
//         marginRight: 10,
//         marginLeft: 10
//     },
//     SubmitButtonStyleSmallBlue: {
//         alignSelf:'center',
//         width: 130,
//         marginTop:30,
//         paddingTop:15,
//         paddingBottom:15,
//         backgroundColor:'#144b82',
//         borderWidth: 1,
//         borderColor: '#fff',
//         marginRight: 10,
//         marginLeft: 10
//     },
//     TextStyle:{
//         color:'#fff',
//         textAlign:'center',
//     },
//     backgroundImage: {
//         flex: 1,
//         width: wp(100),
//         height: hp(100),
        
//     },
//     backgroundImage2: {
//         alignSelf: 'center',
//     },
// });
