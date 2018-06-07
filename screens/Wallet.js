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
  TouchableHighlight
} from 'react-native';



// for crypto
import '../shim.js'
import crypto from 'crypto'

// Android and Ios native modules
import {NativeModules} from 'react-native';
// ios
var CreateWallet = NativeModules.CreateWallet;
// android
var AndroidWallet = NativeModules.AndroidWallet;


export default class Wallet extends React.Component{
// export default class App extends Component<{}> {


    static navigationOptions = {
      drawerLabel: 'WALLET',
      drawerIcon: ({ tintColor }) => (
        <Image source={require('../resources/images/wallet_drawer_icon.png')} resizeMode={Image.resizeMode.contain}  style={{width:30, height:30}}/>
      ),
    };


    state={
        address: '',
        passphrase : '',
        treeHeight: "0",
        signatureCounts : 0,
        hashFunction: '',
        processing: false
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
        try {
            let androidWalletStr = await AndroidWallet.createWallet();
            console.log(androidWalletStr);
        } catch (e) {
            console.error(e);
        }
    }



    // IOS
    createWallet = () => {

        this.setState({processing:true})
        const randomBytes = crypto.randomBytes(48)
        // console.log(randomBytes)

        // CreateWallet.createWallet("YEAHHHH")
        CreateWallet.createWallet(this.state.treeHeight, this.state.hashFunction,(error, pk)=> {
            this.setState({processing:false, address:pk})
            console.log("REACTNATIVE :wallet address is :",pk)
        })
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


    render() {
        // this.helloWorld();
        return (
            <ImageBackground source={require('../resources/images/main_background.png')} style={styles.backgroundImage}>
          <View style={{flex:1}}>

          <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:60, paddingLeft:30,flex:0.2}}>
              <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='white'>
            <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
            </TouchableHighlight>
          </View>

          <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.androidWallet }>
              <Text style={styles.TextStyle}> Create wallet Android </Text>
          </TouchableOpacity>

          <View style={{ alignItems:'center',paddingTop:20, flex:0.5}}>
              <Image source={require('../resources/images/qrl_logo_wallet.png')} resizeMode={Image.resizeMode.contain} style={{height:100, width:100}} />
           </View>

           <View style={{ alignItems:'center',paddingTop:10 ,flex:1}}>
               <ImageBackground source={require('../resources/images/fund_bg.png')} resizeMode={Image.resizeMode.contain} style={{height:280, width:300, justifyContent:'center',alignItems:'center'}} >
                   <Text style={{color:'white'}}>QRL BALANCE</Text>
                   <Text style={{color:'white',fontSize:30}}>34511.7</Text>
               </ImageBackground>
            </View>

            <View style={{ alignItems:'center',paddingTop:20, padding:20,margin:10, flex:0.2}}>
                <Text style={{color:'white'}}>YOUR PUBLIC ADDRESS</Text>
                <Text style={{color:'white', textAlign:'center'}}>Q01070056562525c06b16d05683f509ac20090458f4ec8617369e3701d5c3d728323576f9788e20</Text>
             </View>

             <View style={{ alignItems:'center',paddingTop:20, flex:0.2}}>
                 <Image source={require('../resources/images/qr_code.png')} resizeMode={Image.resizeMode.contain} style={{height:100, width:100}} />
              </View>

              <View style={{ alignItems:'center',paddingTop:20, flex:0.7}}>
                  <Image source={require('../resources/images/wallet_bottom.png')} resizeMode={Image.resizeMode.contain} style={{height:200, width:400}} />
               </View>



            {/*
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
