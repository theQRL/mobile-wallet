import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Image,
  ActionSheetIOS,
  TextInput,
  Button,
  ActivityIndicator,
  Picker,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  ListView
} from 'react-native';



// for crypto
import '../shim.js'
import crypto from 'crypto'

// Android and Ios native modules
import {NativeModules} from 'react-native';
// ios
var CreateWallet = NativeModules.CreateWallet;
//var RefreshWallet = NativeModules.refreshWallet;

var IosWallet = NativeModules.IosWallet;
// android
var AndroidWallet = NativeModules.AndroidWallet;



var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var testjson =[{}]

// var proto = require('../../grpc-web/compiled.js');
export default class Wallet extends React.Component{
// export default class App extends Component<{}> {


    static navigationOptions = {
      drawerLabel: 'WALLET',
      drawerIcon: ({ tintColor }) => (
        <Image source={require('../resources/images/wallet_drawer_icon.png')} resizeMode={Image.resizeMode.contain}  style={{width:30, height:30}}/>
      ),
    };

    constructor(props) {
      super(props);
      this.state = {
        isLoading: true,
        passphrase : '',
        treeHeight: "0",
        signatureCounts : 0,
        hashFunction: 'SHAKE_128',
        processing: false,
        balance : 0,
        // walletAddress : "010500c0183a30c9170c8daf0a25d91f2102c49994a04e81a18286c1e345121f33037301c70c38"
        walletAddress : "0105006d232eb403a0248f9d4c0476c06a7d7a1d0425420df2dd915b7fb46cf7da132699c27b93"
      }
    }

    componentDidMount() {
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
            isLoading: false,
            dataSource: ds.cloneWithRows([])
        });
    }



    state={
    }



    // ANDROID
    // async helloWorld() {
    //     try {
    //         let helloWorldStr = await HelloWorld.helloWorld();
    //         console.log(helloWorldStr);
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    // ANDROID
    async androidWallet() {

        // This is the example with Promise
        // try {
        //     let androidWalletStr = await AndroidWallet.createWallet();
        //     console.log(androidWalletStr);
        // } catch (e) {
        //     console.error(e);
        // }

        // This is the example with callback
        AndroidWallet.createWallet(8, 3, (msg) => {console.log(msg)}, (wallet) => {console.log("Android wallet is " + wallet)} );

        // UIManager.measureLayout(100,100,(msg) => {console.log(msg);},(x, y, width, height) => {console.log(x + ':' + y + ':' + width + ':' + height);});
    }


    // IOS
    createWallet = () => {

        this.setState({processing:true})
        const randomBytes = crypto.randomBytes(48)
        // console.log(randomBytes)
        this.setState({hashFunction: "SHAKE_128"})

        // CreateWallet.createWallet("YEAHHHH")
        CreateWallet.createWallet("8", 3, (error, pk)=> {
            this.setState({processing:false, address:pk})
            console.log("REACTNATIVE :wallet address is :",pk)

        })
    }


    // Refresh wallet balance
    refreshWallet = () => {
        // Ios
        if (Platform.OS === 'ios'){
            this.setState({isLoading:true})
            IosWallet.refreshWallet(this.state.walletAddress, (error, balance, keys)=> {
                console.log("KEEEYS ARE : ", keys)

                this.setState({isLoading:false, balance: balance, dataSource: ds.cloneWithRows(JSON.parse(keys) )})
            });
        }
        // Android
        else {
            AndroidWallet.refreshWallet(this.state.walletAddress, (err) => {console.log(err)}, (balance) => {
                this.setState({isLoading:false, balance: balance})
            });
        }

    }


    showActionSheet = () => {

        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel','Height:8, Signatures:256', 'Height:10, Signatures:1.024','Height:12, Signatures:4,096','Height:14, Signatures:16,384','Height:16, Signatures:65,536','Height:18, Signatures:262,144'],
            cancelButtonIndex: 0,
        },
        (buttonIndex) => {
            // if (buttonIndex === 1) { /* destructive action */ }
            if (buttonIndex === 1) { this.setState({treeHeight: "8", signatureCounts: 256}) }
            if (buttonIndex === 2) { this.setState({treeHeight: "10", signatureCounts: 1024}) }
            if (buttonIndex === 3) { this.setState({treeHeight: "12", signatureCounts: 4096}) }
            if (buttonIndex === 4) { this.setState({treeHeight: "14", signatureCounts: 16384}) }
            if (buttonIndex === 5) { this.setState({treeHeight: "16", signatureCounts: 262144}) }
        });
    }


    showHashSheet = () => {

        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel','Hash Function: SHAKE_128','Hash Function: SHAKE_256','Hash Function: SHA2_256'],
            cancelButtonIndex: 0,
        },
        (buttonIndex) => {
            // if (buttonIndex === 1) { /* destructive action */ }
            if (buttonIndex === 1) { this.setState({hashFunction: "SHAKE_128"}) }
            if (buttonIndex === 2) { this.setState({hashFunction: "SHAKE_256"}) }
            if (buttonIndex === 3) { this.setState({hashFunction: "SHA2_256"}) }
        });
    }


    renderRow(rowData, sectionID, rowID) {
        return (
            <View style={{flex: 1, flexDirection:'row',  height:80, paddingTop:20}}>
                <View>
                    <Image source={require('../resources/images/received.png')} resizeMode={Image.resizeMode.contain} style={{height:40, width:40,marginLeft:10, marginRight:10}} />
                </View>

                <View>
                    <Text>{rowData.title}</Text>
                    <Text>{rowData.date}</Text>
                    <Text>{rowData.desc}</Text>


                </View>
          </View>
          );
    }


    ListViewItemSeparator = () => {
      return (
        <View
          style={{height: .5,width: "90%",backgroundColor: "#000",alignSelf:'center'}}
        />
      );
    }


    render() {


        if (this.state.isLoading) {
            return (
              <View style={{flex: 1, paddingTop: 20}}>
                <ActivityIndicator />
              </View>
            );
          }


        // this.helloWorld();
        return (
            <ImageBackground source={require('../resources/images/main_background.png')} style={styles.backgroundImage}>
          <View style={{flex:1}}>

          <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:60, paddingLeft:30,flex:0.1}}>
              <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='white'>
            <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
            </TouchableHighlight>
          </View>



          {/*

              The following code is functional and creates the android and ios wallets


          <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.androidWallet }>
              <Text style={styles.TextStyle}> Create wallet Android </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.createWallet }>
              <Text style={styles.TextStyle}> Create wallet iOS </Text>
          </TouchableOpacity>

          */}




          <ScrollView style={{flex:2}}>

          <View style={{ alignItems:'center',paddingTop:20, flex:0.5}}>
              <Image source={require('../resources/images/qrl_logo_wallet.png')} resizeMode={Image.resizeMode.contain} style={{height:100, width:100}} />
              <Text style={{color:'white'}}>LAST UPDATE: MAY 28TH</Text>
           </View>



           <View style={{ alignItems:'center',paddingTop:10 ,flex:1}}>
               <ImageBackground source={require('../resources/images/fund_bg.png')} resizeMode={Image.resizeMode.contain} style={{height:280, width:300, justifyContent:'center',alignItems:'center'}} >
                   <Text style={{color:'white'}}>QRL BALANCE</Text>
                   <Text style={{color:'white',fontSize:30}}>{this.state.balance / 1000000000 }</Text>

               <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.refreshWallet }>
                   <Text style={styles.TextStyle}> Refresh </Text>
               </TouchableOpacity>
               </ImageBackground>
            </View>


            <View style={{backgroundColor:'white', flex:2, width:330, alignSelf:'center'}}>
                <Text style={{alignItems:'center', alignSelf:'center', paddingTop:20, marginBottom:20}}>TRANSACTION HISTORY</Text>
                <ListView automaticallyAdjustContentInsets={false} dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} renderSeparator= {this.ListViewItemSeparator} enableEmptySections={true} />
            </View>

        </ScrollView>

{/*
              <View style={{ alignItems:'center',paddingTop:20, flex:0.7,position: 'absolute', left: 0, right: 0, bottom: -20}}>
                  <Image source={require('../resources/images/wallet_bottom.png')} resizeMode={Image.resizeMode.contain} style={{height:200, width:400}} />
               </View>




          <View style={styles.container}>

                <Text style={styles.welcomeBig}>
                  Welcome to the QRL
                </Text>

                <Text style={styles.welcome}>
                    Three height : {this.state.treeHeight ===  "0" ? <Text style={styles.welcomeRed} onPress={this.showActionSheet}> Please choose</Text> : <Text style={styles.welcome} onPress={this.showActionSheet}> {this.state.treeHeight}</Text> }
                </Text>
                <Text style={styles.welcome}>
                    Signatures : {this.state.signatureCounts === 0 ? <Text>Undefined</Text> : <Text>{this.state.signatureCounts}</Text> }
                </Text>



                <Text style={styles.welcome}>
                    Hash function : {this.state.hashFunction ===  "" ? <Text style={styles.welcomeRed} onPress={this.showHashSheet}> Please choose</Text> : <Text style={styles.welcome} onPress={this.showHashSheet}> {this.state.hashFunction}</Text> }
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

            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.helloWorld }>
                <Text style={styles.TextStyle}> Create wallet Android </Text>
            </TouchableOpacity>



            {this.state.processing ? <View><ActivityIndicator size={'large'}></ActivityIndicator></View>:<View>

                <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.createWallet }>
                    <Text style={styles.TextStyle}> Create wallet </Text>
                </TouchableOpacity>
            </View>}

                {this.state.address === "" ? <Text></Text> : <Text style={styles.welcome}> QRL wallet address: Q{this.state.address}</Text>}
          </View>
          */}

      </View>
    </ImageBackground>

        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  welcomeBig: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  welcomeRed: {
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    color: "red"
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
},
backgroundImage: {
  flex: 1,
  // remove width and height to override fixed static size
  width: null,
  height: null,
},


});
