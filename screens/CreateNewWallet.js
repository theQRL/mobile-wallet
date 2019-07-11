import React from 'react';
import {Platform, Text, View, Alert, Button, Image, StyleSheet, Modal, ImageBackground, TouchableOpacity, TouchableHighlight, AsyncStorage, ListView, ScrollView, AppState} from 'react-native';
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.CreateWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import PINCode from '@haskkor/react-native-pincode'
import BackgroundTimer from 'react-native-background-timer';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class CreateNewWallet extends React.Component {

    // seetings for react-native navigation
    static navigationOptions = {
        drawerLabel: 'WALLETS',
        drawerIcon: ({ tintColor }) => (
            <Image
            source={require('../resources/images/wallet_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}
            />
        ),
    };

    // get the required information from asyncStorage
    componentWillMount(){
        AppState.addEventListener('change', this._handleAppStateChange);
        // get walletlist JSON
        console.log("MOUNTING WALLETS")
        AsyncStorage.getItem("walletlist").then((walletlist) => {
            // get walletindex (index of the opened wallet)
            AsyncStorage.getItem("walletindex").then((walletindex) => {
                this.setState({isLoading:false, walletindex: walletindex, dataSource: ds.cloneWithRows(JSON.parse(walletlist)), walletlist: JSON.parse(walletlist) })
            }).catch((error) => {console.log(error)});
        }).catch((error) => {console.log(error)});
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
        isLoading: true,
        modalVisible: false,
        walletIndexToOpen: null,
        deleteModalVisible: false,
        appState: AppState.currentState,
    }

    // popup to confirm wallet removal
    removeWalletPopup = (walletid) => {
        Alert.alert( "REMOVE WALLET"  , "Do you really want to remove this wallet from the app?" , [
            {
                text: "Cancel", 
                onPress: () => {console.log("Canceled")}
            }, 
            {
                text: "Remove",
                onPress: () => this.openDeleteModal(walletid)
            }
        ])
    }

    // remove wallet from the app
    removeWallet = (walletid, walletlist) => {
        var c, found=false;
        for(c in walletlist) {
            if(walletlist[c]["index"] == walletid) {
                found=true;
                break;
            }
        }
        if(found){
            // remove wallet from keychain
            if (Platform.OS === 'ios'){
                IosWallet.closeWallet(walletid,  (err, status)=> {
                    // if success then delete the wallet from the app
                    if (status =="success"){
                        walletlist.splice(c, 1);
                        AsyncStorage.setItem("walletlist",  JSON.stringify( walletlist ))
                        this.setState({ dataSource: ds.cloneWithRows(JSON.parse(JSON.stringify( walletlist ))) })
                    }
                    else {
                        console.log("ERROR while removing wallet: ", err)
                    }
                })
            }
            // Android
            else {
                AndroidWallet.closeWallet( walletid, (err) => {console.log(err); }, (status) => {
                    if (status =="success"){
                        walletlist.splice(c, 1);
                        AsyncStorage.setItem("walletlist",  JSON.stringify( walletlist ))
                        this.setState({ dataSource: ds.cloneWithRows(JSON.parse(JSON.stringify( walletlist ))) })
                    }
                    else {
                        console.log("ERROR while removing wallet: ", error)
                    }
                })
            }
        }
    }

    openHexseedModal = (walletindexToOpen) => {
        // this.setState({modalVisible: true, walletIndexToOpen: walletindexToOpen })
        this.props.navigation.navigate('OpenExistingWalletModal',{onGoBack: () => this.refreshWalletIndex(), walletIndexToOpen: walletindexToOpen})
    }


    openDeleteModal = (walletindexToDelete) => {
        // this.setState({modalVisible: true, walletIndexToOpen: walletindexToOpen })
        this.props.navigation.navigate('DeleteWalletModal',{onGoBack: () => this.removeWallet(walletindexToDelete, this.state.walletlist), walletIndexToDelete: walletindexToDelete })
    }

    // Launch wallet creation process
    closeWallet = () => {
        this.setState({isLoading: true});
        this.props.navigation.navigate( 'SignIn', { closable: true});
        // AsyncStorage.removeItem("walletcreated");
    }

    // View for current wallet
    renderCurrentWalletRow(rowData, sectionID, rowID) {
        // format the QUANTA amount
        addressBegin = rowData.address.substring(1, 5);
        addressEnd = rowData.address.substring(65, 79);

        // only return information related to current wallet
        if (this.state.walletindex == rowData.index){
            return (
                <View  style={{flex: 1, flexDirection:'row', alignSelf:'center', height:80, width:300}}>
                    <View style={{flex:1, justifyContent:'center'}}>
                        <Image source={require('../resources/images/wallet_unlocked.png')} resizeMode={Image.resizeMode.contain} style={{height:35, width:35}} />
                    </View>
                    <View style={{flex:5, justifyContent:'center'}}>
                        <Text>Q{addressBegin}...{addressEnd}</Text>
                    </View>
                    <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                        <TouchableHighlight onPress={()=> this.props.navigation.navigate( "ShowQrCodeModal", {qrcode:rowData.address} )} underlayColor='white'>
                            <Image source={require('../resources/images/qr_code_icon.png')} resizeMode={Image.resizeMode.contain} style={{height:35, width:35}} />
                        </TouchableHighlight>
                    </View>
                </View>
            );    
        }
        else {
            return(
                <View></View>
            );
        }
    }

    // ListView for the wallet list
    renderRow(rowData, sectionID, rowID) {
        if (this.state.walletindex != rowData.index){
            // format the QUANTA amount
            addressBegin = rowData.address.substring(1, 5);
            addressEnd = rowData.address.substring(65, 79);

            return (
                <View>
                    <View  style={{flex: 1, flexDirection:'row', alignSelf:'center', height:80, width:300}} onPress={()=> this.props.navigation.navigate('TxDetailsView', {txhash: txhash})} underlayColor='white'>
                        <View style={{flex:6, flexDirection:'row'}}>
                            <TouchableHighlight onPress={() => this.openHexseedModal(rowData.index)  } underlayColor='white' style={{flex:1, justifyContent:'center'}}>    
                                <View style={{flex:1, flexDirection:'row'}}>
                                    <View style={{flex:1, justifyContent:'center'}}>
                                        <Image source={require('../resources/images/wallet_locked.png')} resizeMode={Image.resizeMode.contain} style={{height:35, width:35}} />
                                    </View>
                                    <View style={{flex:5, justifyContent:'center', paddingLeft:5}}>
                                        <Text>Q{addressBegin}...{addressEnd} </Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.navigate( "ShowQrCodeModal", {qrcode:rowData.address} )} underlayColor='white'>
                                <Image source={require('../resources/images/qr_code_icon.png')} resizeMode={Image.resizeMode.contain} style={{height:35, width:35}} />
                            </TouchableHighlight>
                        </View>
                        <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                            <TouchableHighlight onPress={() => this.removeWalletPopup(rowData.index)  }  underlayColor='white'>
                                <Image source={require('../resources/images/trash_solid.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                            </TouchableHighlight>                    
                        </View>
                    </View>
                </View>
            );
        }
        else {
            return(
                <View></View>
            );
        }
    }

    // refresh wallet index on switch
    refreshWalletIndex(){
        // get walletindex (index of the opened wallet)
        this.setState({isLoading:true});
        AsyncStorage.getItem("walletindex").then((walletindex) => {
            this.setState({isLoading:false, walletindex: walletindex})
        }).catch((error) => {console.log(error)});
    }

  // render view
  render() {

      if (this.state.isLoading){
          return(<View><Text>Loading...</Text></View>)
      }
      else {
          return (
              <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>

                <View style={{flex:1}}>
                    <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                        <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
                          <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                        </TouchableHighlight>
                    </View>

                    <ScrollView style={{flex:2}}>
                        <View style={{ height:130, width:330, borderRadius:10, alignSelf:'center', marginTop: 30}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage2}>
                                <View style={{flex:1, alignSelf:'center', width:330, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{color:'white', fontSize:20}}>WALLETS</Text>
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={{flex:1, paddingTop: 10, marginBottom:40, width:330, alignSelf: 'center',  borderRadius:10, backgroundColor:'white'}}>
                            <View style={{alignItems:'center'}}>
                                <Text>CURRENT WALLET</Text>
                                <ListView automaticallyAdjustContentInsets={false} dataSource={this.state.dataSource} renderRow={this.renderCurrentWalletRow.bind(this)} enableEmptySections={true} />
                            </View>
                            <View style={{width:'100%', height:8, backgroundColor:'green', borderBottomWidth :1,borderBottomColor: 'green', borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}></View>
                        </View>
            
                        {this.state.walletlist.length > 1 ? 
                            <View style={{flex:1, paddingTop: 10, width:330, alignSelf: 'center',  borderRadius:10, backgroundColor:'white'}}>
                                <View style={{alignItems:'center'}}>
                                    <Text>EXISTING WALLETS</Text>
                                    <ListView automaticallyAdjustContentInsets={false} dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true} />
                                </View>
                            </View>
                            :
                            undefined
                        }

                        <View style={{paddingTop:50, paddingRight:20, alignSelf:'flex-end'}}>
                            <TouchableOpacity onPress={ this.closeWallet } >
                                <Image source={require('../resources/images/icon_plus.png')} resizeMode={Image.resizeMode.contain} style={{height:65, width:65}} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
          );
      }
  }

}


const styles = StyleSheet.create({
    SubmitButtonStyle: {
        alignSelf:'flex-end',
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
