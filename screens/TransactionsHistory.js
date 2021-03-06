import React, { Component } from 'react';
import { Platform, StyleSheet, ImageBackground, Text, View, Image, BackHandler, ActionSheetIOS, TextInput, Button, ActivityIndicator, Picker, TouchableOpacity, ScrollView, TouchableHighlight, ListView, AsyncStorage, AppState, Animated, Easing} from 'react-native';
// import Reactotron from 'reactotron-react-native'
// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
const moment = require('moment');
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
// import 'moment/locale/*.js'
import 'moment/min/locales';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";

export default class Wallet extends React.Component{

    // static navigationOptions = {
    //     drawerLabel: 'BALANCE',
    //     drawerIcon: ({ tintColor }) => (
    //         <Image source={require('../resources/images/transaction_history_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain}  style={{width:25, height:25}}/>
    //     ),
    // };

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        AppState.removeEventListener('change', this._handleAppStateChange);
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
                console.log(unlockWithPin)
                console.log(needPinTimeout)
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


    // every time we open the main page fo the following
    // 1. update cmc related info
    // 2. update list of 10 latest tx
    componentDidMount() {
        // disable back button on Android
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        // Show error Flash message if loading is taking too long
        setTimeout(() => {
            if (this.state.isLoading){
                showMessage({
                    message: "Taking too long? Check your node configuration Settings",
                    type: "info",
                    backgroundColor: "#EB2E42",
                    duration: 5000,
                    onPress: () => {
                        this.props.navigation.navigate('Settings')
                    },
                });
            }
        }, 5000);

        AppState.addEventListener('change', this._handleAppStateChange);

        // console.log(DeviceInfo.getDeviceLocale())
        if (DeviceInfo.getDeviceLocale().includes('locale')){
            this.setState({is24h: DeviceInfo.is24Hour(), deviceLocale: DeviceInfo.getDeviceLocale().split('/')[2] })
        }
        else {
            this.setState({is24h: DeviceInfo.is24Hour(), deviceLocale: DeviceInfo.getDeviceLocale() })
        }
        
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // update QRL market data
        fetch('http://market-data.automated.theqrl.org/', {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
        .then((responseJson) => {
            this.setState({marketcap: Number((parseFloat(responseJson.market_cap)).toFixed()), price: Number((parseFloat(responseJson.price)).toFixed(2)) , change24: Number((parseFloat(responseJson.change_24hr)).toFixed(2)) })
            
            if (responseJson.change_24hr.includes("-")){this.setState({changeup: false})}
            else {this.setState({changeup: true})}

            // Update the wallet each time the user switch to this view
            // get the currect walletindex
            AsyncStorage.getItem("walletindex").then((walletindex) => {
                if (Platform.OS === 'ios'){
                    IosWallet.refreshWallet(walletindex, (error, walletAddress, otsIndex, balance, keys)=> {
                        this.setState({walletAddress: walletAddress, isLoading:false, updatedDate: new Date(), balance: balance, otsIndex: otsIndex, dataSource: ds.cloneWithRows(JSON.parse(keys)), tx_count: JSON.parse(keys).length})
                    });
                }
                // Android
                else {
                    AndroidWallet.refreshWallet(walletindex,  (err) => { console.log("WEEOEEEEE....."); }, (walletAddress, otsIndex, balance, keys)=> {
                        this.setState({walletAddress: walletAddress, isLoading:false, updatedDate: new Date(), balance: balance, otsIndex: otsIndex, dataSource: ds.cloneWithRows(JSON.parse(keys)), tx_count: JSON.parse(keys).length })
                    });
                }
            }).catch((error) => {console.log(error)});
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            spinAnim: new Animated.Value(0) ,
            updatedDate : new Date(),
            isLoading: true,
            passphrase : '',
            processing: false,
            balance : 0,
            refreshBtnTop: Platform.OS === 'ios'? 10: 8,
            appState: AppState.currentState,
        }
    }

    // Refresh wallet balance
    refreshWallet = () => {
        fetch('http://market-data.automated.theqrl.org/', {
            method: 'GET',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            },
        }).then((response) => response.json())
        .then((responseJson) => {
            this.setState({marketcap: Number((parseFloat(responseJson.market_cap)).toFixed()), price: Number((parseFloat(responseJson.price)).toFixed(2)) , change24: Number((parseFloat(responseJson.change_24hr)).toFixed(2)) })

            if (responseJson.change_24hr.includes("-")){this.setState({changeup: false})}
            else {this.setState({changeup: true})}

            // Update the wallet each time the user switch to this view
            // Ios
            this.setState({isLoading:true})
            // get the currect walletindex
            AsyncStorage.getItem("walletindex").then((walletindex) => {
                if (Platform.OS === 'ios'){
                    IosWallet.refreshWallet(walletindex, (error, walletAddress, otsIndex, balance, keys)=> {
                        this.setState({walletAddress: walletAddress, isLoading:false, updatedDate: new Date(), balance: balance, otsIndex: otsIndex, dataSource: ds.cloneWithRows(JSON.parse(keys)), tx_count: JSON.parse(keys).length})
                    });
                }
                // Android
                else {
                    AndroidWallet.refreshWallet(walletindex, (err) => {console.log( "ERROR FROM JAVA :", err);}, (walletAddress, otsIndex, balance, keys)=> {
                        this.setState({walletAddress: walletAddress, isLoading:false, updatedDate: new Date(), balance: balance, otsIndex: otsIndex, dataSource: ds.cloneWithRows(JSON.parse(keys)), tx_count: JSON.parse(keys).length})
                    });
                }

            }).catch((error) => {console.log(error)});
        })
    }

    renderRow(rowData, sectionID, rowID) {
        // format the QUANTA amount
        if (rowData.desc % 1000000000 == 0){
            amount = rowData.desc / 1000000000
        }
        else {
            amount = rowData.desc / 1000000000
        }
        var txhash = rowData.txhash;

        return (
            <TouchableHighlight onPress={()=> this.props.navigation.navigate('TxDetailsView', {txhash: txhash})} underlayColor='white'>
            <View>
                <View style={{flex: 1, flexDirection:'row',  height:80, paddingTop:20}}>

                    {rowData.title == "RECEIVED" ?
                        <View>
                            <Image source={require('../resources/images/received.png')} resizeMode={'contain'} style={{height:40, width:40,marginLeft:20, marginRight:10}} />
                        </View>
                    :
                        <View>
                            <Image source={require('../resources/images/sent.png')} resizeMode={'contain'} style={{height:40, width:40,marginLeft:20, marginRight:10}} />
                        </View>
                    }
                    <View style={{flex:1, flexDirection:'row'}}>
                        <View style={{flex:1,alignItems:'flex-start'}}>
                            <Text>{rowData.title}</Text>
                            <Text>{rowData.date}</Text>
                        </View>
                        <View style={{alignItems:'flex-end', paddingRight:20}}>
                            <Text style={{color:'#15437a'}}>{amount.toString()} QUANTA</Text>
                            {rowData.unconfirmed != null ? 
                               <Text style={{color:'red'}}>UNCONFIRMED</Text>
                                : 
                                undefined
                            }
                        </View>
                    </View>
                </View>

                {/*Do not show separator on the last item of the list*/}
                { rowID <= this.state.tx_count - 2  ? 
                    <View style={{height: .5,width: "90%",backgroundColor: "#000",alignSelf:'center'}}/>
                    :
                    undefined
                }
                </View>

            </TouchableHighlight>
          );
    }

    render() {
        
        // Reactotron.log('Reactotron connected')
        const spin = this.state.spinAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        if (this.state.isLoading) {
            Animated.loop(Animated.timing(
                this.state.spinAnim,
              {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear
              }
            )).start();
        }
 
    
            else {
                Animated.timing(this.state.spinAnim).stop();
                minutes = this.state.updatedDate.getMinutes();
                if (this.state.is24h){
                    hours = this.state.updatedDate.getHours()
                }
                else {
                    hours = this.state.updatedDate.getHours() > 12 ? this.state.updatedDate.getHours() - 12 : this.state.updatedDate.getHours();
                }
                minutes < 10 ? minUI = "0" + minutes : minUI = minutes;
                // addressBegin = this.state.walletAddress.substring(1, 10);
                // addressEnd = this.state.walletAddress.substring(58, 79);
                // moment.locale(this.state.deviceLocale);
                formattedDate = moment(this.state.updatedDate).locale( this.state.deviceLocale.indexOf("-") === -1 ? this.state.deviceLocale : this.state.deviceLocale.substr(0, this.state.deviceLocale.indexOf('-')) ).format('LL');
            }

            return (
                <View style={{flex:1}}>
                <ImageBackground source={require('../resources/images/main_bg_half.png')} style={styles.backgroundImage}>
                    <View accessibilityLabel="TransactionsHistory" style={{flex:1}}>

                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477' >
                                <Image source={require('../resources/images/sandwich.png')} resizeMode={'contain'} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>
                        <FlashMessage/> 
                    
                        <ScrollView style={{flex:2}}>
                            <View style={{ alignItems:'center',paddingTop:10, flex:0.5}}>
                                <Image source={require('../resources/images/qrl_logo_wallet.png')} resizeMode={'contain'} style={{height:100, width:100}} />
                                {/* <Text style={{color:'white'}}>LAST UPDATE: {this.state.updatedDate.getDate()}.{this.state.updatedDate.getMonth() + 1}.{this.state.updatedDate.getFullYear()} {hours}:{minUI}</Text> */}

                                {this.state.isLoading? 
                                    <View style={{height:15}}>
                                        <ShimmerPlaceHolder autoRun={true} height={12} width={wp(50)} colorShimmer={['#184477', '#c5c5c5', '#184477']} />
                                    </View>
                                    : 
                                    <View style={{height:15}}>
                                        <Text style={{color:'white', fontSize:12}}>Last update: {formattedDate} {hours}:{minUI}</Text> 
                                    </View>
                                } 
                            </View>

                            <View style={{height:250,  alignItems:'center',flex:1, borderRadius:10}}>
                                <ImageBackground source={require('../resources/images/fund_bg.png')} imageStyle={{resizeMode: 'contain'}} style={{height:240, width:wp(96), justifyContent:'center',alignItems:'center', paddingTop: 30, paddingLeft:10, paddingRight:10}} >
                                    {this.state.isLoading ? 
                                        <View style={{height: 30}}>
                                            <ShimmerPlaceHolder autoRun={true} height={12} width={wp(90)} colorShimmer={['#f33160', '#c5c5c5', '#f33160']} />
                                            <ShimmerPlaceHolder autoRun={true} height={12} width={wp(90)} colorShimmer={['#f33160', '#c5c5c5', '#f33160']} />
                                        </View>
                                        : 
                                        <View  style={{height: 30}}>
                                            <Text style={{color:'white', fontWeight: "bold", fontSize:12,textAlign:'center'}} selectable={true}>Q{this.state.walletAddress}</Text>
                                        </View>
                                    }
                                    {this.state.isLoading ? 
                                        <View style={{height: 30}}>
                                            <ShimmerPlaceHolder autoRun={true} height={30} colorShimmer={['#f33160', '#c5c5c5', '#f33160']} />
                                        </View>
                                        :
                                        <View style={{height: 30}}>
                                            <Text style={{color:'white',fontSize:30}}>{this.state.balance / 1000000000 } QRL</Text>
                                        </View>
                                    }
                                    
                                    <View style={{paddingTop:5}}>
                                        <Text style={{color:'white',fontSize:13}}>USD ${ ((this.state.balance / 1000000000 ) * this.state.price).toFixed(2) }</Text>
                                    </View>

                                    <View style={{width:"80%", height:40, borderRadius:10, flexDirection:'row', paddingTop:15,paddingBottom:5}}>
                                        <View style={{flex:1}}><Text style={{fontSize:12, color:"white"}}>MARKET CAP</Text></View>
                                        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text style={{fontSize:12, color:"white"}}>PRICE</Text></View>
                                        <View style={{flex:1}}><Text style={{fontSize:12, color:"white", right:-10}}>24H CHANGE</Text></View>
                                    </View>

                                    <View style={{backgroundColor:"#d12835", height:40, flexDirection:'row', width:"90%", borderRadius:10, paddingLeft:15}}>
                                        <View style={{flex:1, justifyContent:'center'}}><Text style={{fontSize:12, color:"white",fontWeight: "bold"}}>${ (this.state.marketcap / 1000000).toFixed(2) }M <Text style={{fontSize:8, color:"white"}}>USD</Text></Text></View>

                                        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}><Text style={{fontSize:12, color:"white",fontWeight: "bold"}}>${this.state.price}<Text style={{fontSize:8, color:"white"}}> USD</Text></Text></View>

                                        { this.state.changeup ?
                                            <View style={{flex:1, justifyContent:'center'}}>
                                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                                    <Image source={require('../resources/images/arrow_up.png')} resizeMode={'contain'} style={{height:10, width:10}} />
                                                    <Text style={{fontSize:12, color:"white"}}>({this.state.change24} %)</Text>
                                                </View>
                                            </View>
                                            :
                                            <View style={{flex:1, justifyContent:'center'}}>
                                                <View style={{flexDirection:'row', justifyContent:'center'}}>
                                                    <Image source={require('../resources/images/arrow_down.png')} resizeMode={'contain'} style={{height:10, width:10}} />
                                                    <Text style={{fontSize:12, color:"white"}}>({this.state.change24} %)</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>

                                    <View style={{alignSelf:'flex-end', right:23}}>
                                        <Text style={{color:'white',fontSize:10}}>Powered by COINLIB</Text>
                                    </View>

                                    <TouchableOpacity style={{ alignItems:'center',justifyContent:'center',alignSelf:'center',top:hp(1), right:2}} activeOpacity = { .5 } onPress={ this.refreshWallet }>
                                        <Animated.Image style={{height:30, width: 30, transform: [{rotate: spin}] }} source={require("../resources/images/refresh.png")}/>
                                        {/* <Image source={require("../resources/images/refresh.png")} style={{height:30, width:30}}/> */}
                                    </TouchableOpacity>

                                </ImageBackground>
                            </View>

                            <View style={{backgroundColor:'white', flex:2, width:wp(93), alignSelf:'center', borderRadius:10, marginTop:10, marginBottom:20}}>
                                <Text style={{alignItems:'center', alignSelf:'center', paddingTop:20, marginBottom:20}}>TRANSACTION HISTORY</Text>
                                <View style={{height: .5,width: "90%",backgroundColor: "#000",alignSelf:'center'}}/>
                                {this.state.tx_count == 0 || this.state.tx_count == undefined ?
                                    <Text style={{alignSelf:'center'}}>No Transaction yet</Text>
                                    :
                                    <ListView automaticallyAdjustContentInsets={false} dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />
                                }
                            </View>
                        </ScrollView>
                        {/* <View style={{height:30}}></View> */}
                    </View>
                </ImageBackground>
                </View>
            );
        }
    // }
}

// styling
const styles = StyleSheet.create({
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
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    }
});
