
import React, { Component } from 'react';
import { Button, Text, ImageBackground, ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Image, Linking } from 'react-native';
import { DrawerNavigator , StackNavigator, SwitchNavigator, DrawerItems } from 'react-navigation'; // Version can be specified in package.json
// Import the different screens
import Wallet from './screens/Wallet'
import Explorer from './screens/Explorer'
import TransactionsHistory from './screens/TransactionsHistory'
import CreateWallet from './screens/CreateWallet'
import Scan from './screens/Scan'


// AuthLoadingScreen checks if a wallet already exists
// - if yes -> redirects to the app main view
// - if no -> redirects to the CreateWallet view
class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
      // check if a wallet was already created
    // const userToken = await AsyncStorage.getItem('userToken');
    const userToken = await AsyncStorage.getItem('rrr');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}



const CustomDrawerContentComponent = (props) => (

    <View style={{flex:1, backgroundColor:'#2d294b', paddingTop:50}}>
        <Image style={{height:80, width:80, alignSelf:'center'}} resizeMode={Image.resizeMode.contain}  source={require('./resources/images/qrl_logo_wallet.png')} />
        <View style={{paddingTop:50}}>
            <DrawerItems {...props}/>
        </View>
        <ImageBackground source={require('./resources/images/lower_drawer_bg.png')} style={{flex:1, height:null, width:null}}>
            <View style={{paddingLeft: 40, paddingTop:50}}>
                <Text style={{color:'white',paddingTop:20}} onPress={() => Linking.openURL('https://theqrl.org/')}>QRL WEBSITE</Text>
                <Text style={{color:'white',paddingTop:20}}>REDDIT</Text>
                <Text style={{color:'white',paddingTop:20}}>DISCORD</Text>
                <Text style={{color:'white',paddingTop:20}}>SUPPORT</Text>
            </View>
    </ImageBackground>
    </View>
)


// MainDrawerMenu
const MainDrawerMenu = DrawerNavigator(
    {
        Wallet :{
            path: '/',
            screen: Wallet,
        },
        Explorer : {
            path: '/',
            screen: Explorer
        },
        TransactionsHistory : {
            path: '/',
            screen: TransactionsHistory
        },
        Scan : {
            path: '/',
            screen: Scan
        },
    },
    {
        initialRouteName: 'Wallet',
        drawerPosition: 'left',
        contentComponent: CustomDrawerContentComponent,
        contentOptions: {
            labelStyle: {
                color: 'white',
            }
        }
    }
);


const AuthStack = StackNavigator({ SignIn: CreateWallet });

export default SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: MainDrawerMenu,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);


// export default MainDrawerMenu
