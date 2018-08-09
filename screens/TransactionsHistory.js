import React from 'react';
import {Text, View, Button, Image, ImageBackground, TouchableOpacity, StyleSheet, TouchableHighlight, ScrollView} from 'react-native';


// Android and Ios native modules
import {NativeModules} from 'react-native';
var RefreshWallet = NativeModules.refreshWallet;






export default class TransactionsHistory extends React.Component {
  static navigationOptions = {
    drawerLabel: 'TRANSACTIONS HISTORY',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../resources/images/transaction_history_drawer_icon.png')} resizeMode={Image.resizeMode.contain} style={{width:30, height:30}}
      />
    ),
  };



      // IOS, refresh wallet balance
      refreshWallet = () => {
          this.setState({processing:true})
          RefreshWallet.refreshWallet("010500b48fb25a343d59eb058e6726f5e8bf9c64ee4ccd26ea1299a1a88e1d64ac82d834d550e9", (error, balance)=> {
              this.setState({processing:false, balance: balance})
          })
      }


  render() {
    return (
            <ImageBackground source={require('../resources/images/main_background.png')} style={styles.backgroundImage}>
          <View style={{flex:1}}>

          <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:60, paddingLeft:30,flex:0.1}}>
              <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='white'>
            <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
            </TouchableHighlight>
          </View>

          <ScrollView style={{flex:2}}>

          <View style={{ alignItems:'center',paddingTop:20, flex:0.1}}>
              <Image source={require('../resources/images/qrl_logo_wallet.png')} resizeMode={Image.resizeMode.contain} style={{height:100, width:100}} />
           </View>



           <View style={{ alignItems:'center',paddingTop:1 ,flex:1}}>
               <ImageBackground source={require('../resources/images/fund_bg.png')} resizeMode={Image.resizeMode.contain} style={{height:200, width:200, justifyContent:'center',alignItems:'center'}} >
                   <Text style={{color:'white'}}>TRANSACTIONS</Text>
                   <Text style={{color:'white',fontSize:30}}></Text>
               </ImageBackground>
            </View>

            <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.refreshWallet }>
                <Text style={styles.TextStyle}> Refresh </Text>
            </TouchableOpacity>




        </ScrollView>

      <View style={{ alignItems:'center',paddingTop:20, flex:0.7,position: 'absolute', left: 0, right: 0, bottom: -20}}>
          <Image source={require('../resources/images/wallet_bottom.png')} resizeMode={Image.resizeMode.contain} style={{height:200, width:400}} />
       </View>

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
