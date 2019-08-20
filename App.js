
import React, { Component } from 'react';
import { Button, Text, ImageBackground, ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Image, Linking, Platform, AppState } from 'react-native';
import { DrawerNavigator , StackNavigator, SwitchNavigator, DrawerItems } from 'react-navigation'; // Version can be specified in package.json
// Import the different screens
import BackupWallet from './screens/BackupWallet'
import SendReceive from './screens/SendReceive'
import TransactionsHistory from './screens/TransactionsHistory'
import Wallets from './screens/Wallets'
import CompleteSetup from './screens/CompleteSetup'
import OpenExistingWalletWithHexseed from './screens/OpenExistingWalletWithHexseed'
import OpenExistingWalletWithMnemonic from './screens/OpenExistingWalletWithMnemonic'
import OpenExistingWalletOptions from './screens/OpenExistingWalletOptions'
import SignIn from './screens/SignIn'
import CreateWalletTreeHeight from './screens/CreateWalletTreeHeight'
import CreateWalletHashFunction from './screens/CreateWalletHashFunction'
// import ScanQrModal from './screens/ScanQrModal'
import ConfirmTxModal from './screens/ConfirmTxModal'
import CreateAdvancedWallet from './screens/CreateAdvancedWallet'
import TxDetailsView from './screens/TxDetailsView'
import ProvideWalletPin from './screens/ProvideWalletPin'
import OpenExistingWalletModal from './screens/OpenExistingWalletModal'
import ShowQrCodeModal from './screens/ShowQrCodeModal'
import Settings from './screens/Settings'
import DeleteWalletModal from './screens/DeleteWalletModal'
import UnlockAppModal from './screens/UnlockAppModal'
import Reactotron from 'reactotron-react-native'
import styles from './screens/styles.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// Android and Ios native modules
import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;
// import { QRLLIB } from './node_modules/qrllib/build/web-libjsqrl.js'

// AuthLoadingScreen checks if a wallet already exists
// - if yes -> redirects to the app main view
// - if no -> redirects to the CreateWallet view
class AuthLoadingScreen extends React.Component {

  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }


  // state = {
  //   appState: AppState.currentState,
  // };

  // componentDidMount() {
  //   AppState.addEventListener('change', this._handleAppStateChange);
  // }
  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  // _handleAppStateChange = (nextAppState) => {
  //   if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
  //       console.log('App has come to the foreground!');
  //       if (global.quitApp){
  //         this.props.navigation.navigate('App')
  //       }
  //   }
  //   if ( nextAppState.match(/inactive|background/) ){
  //       global.quitApp = true;
  //       console.log("HMMMM")
  //       // this.props.navigation.navigate('TransactionsHistory')
  //   }
  //   this.setState({appState: nextAppState});
  // };

	// Fetch the token from storage then navigate to our appropriate place
	_bootstrapAsync = async () => {
		// check if a wallet was already created
    const walletCreated = await AsyncStorage.getItem('walletcreated');
    const unlockWithPin = await AsyncStorage.getItem('unlockWithPin');
    console.log("UNLOCK WITH PIN IS...")
    console.log(unlockWithPin)
    if (unlockWithPin === null){
      AsyncStorage.setItem('unlockWithPin', 'false');
    }
    // This will switch to the App screen or Auth screen and this loading 
    // screen will be unmounted and thrown away.

    // check which network to connect to: node and port
    // check if a node URL and port is already defined
    AsyncStorage.multiGet(["nodeUrl", "nodePort"]).then(storageResponse => {
      // get at each store's key/value so you can work with it
      let nodeUrl = storageResponse[0][1];
      let nodePort = storageResponse[1][1]; 
      // save defaultNode global value
      if (nodeUrl != 'testnet-4.automated.theqrl.org'){
        global.isDefaultNode = false;
      }
      else {
        global.isDefaultNode = true;
      }
      
      Reactotron.log(nodeUrl)
      // if not yet defined
      if (nodeUrl === '' | nodeUrl === null){
        Reactotron.log("SAVING NODE INFO")
        fetch('https://ademcan.net/qrlnetwork.html', {
        // fetch('https://qrl.foundation/qrlnetwork.html', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.json())
      .then((responseJson) => {
        
        if (Platform.OS === 'ios'){
            IosWallet.saveNodeInformation( responseJson.node, responseJson.port, (error, status)=> {
              
              if (status == "saved"){
                this.props.navigation.navigate(walletCreated ? 'App' : 'Auth');
                AsyncStorage.setItem("nodeUrl", responseJson.node);
                AsyncStorage.setItem("nodePort", responseJson.port);
              }
            });  
        }
        else {
            AndroidWallet.saveNodeInformation(responseJson.node, responseJson.port,  (err) => {console.log(err);}, (status)=> {
                if (status == "saved"){
                  this.props.navigation.navigate(walletCreated ? 'App' : 'Auth');
                  AsyncStorage.setItem("nodeUrl", responseJson.node);
                  AsyncStorage.setItem("nodePort", responseJson.port);
                }
            });
        }
        // this.setState({node: responseJson.node, port: responseJson.port })
      })
      .catch((error) => { console.error(error); });
    }
    else {
      this.props.navigation.navigate(walletCreated ? 'App' : 'Auth');
      }
    });
	};

	// Render any loading content that you like here
	render() {
		return (
			<View accessibilityLabel="AppJS">
				<ActivityIndicator />
			</View>
		);
	}
}

const CustomDrawerContentComponent = (props) => (
    <View style={{flex:1, backgroundColor:'#164278', paddingTop:50}}>
        <Image style={{height:80, width:80, alignSelf:'center'}} resizeMode={Image.resizeMode.contain}  source={require('./resources/images/qrl_logo_wallet.png')} />
        <View style={{paddingTop:hp(5)}}>
            <DrawerItems {...props}/>
        </View>
        <ImageBackground source={require('./resources/images/lower_drawer_bg.png')} style={{flex:1, height:null, width:null}}>
            <View style={styles.secondMenu}>
                <Text style={styles.secondMenuItems} onPress={() => Linking.openURL('https://theqrl.org/')}>QRL WEBSITE</Text>
                <Text style={styles.secondMenuItems} onPress={() => Linking.openURL('https://qrl.foundation/')}>QRL FOUNDATION</Text>
                <Text style={styles.secondMenuItems} onPress={() => Linking.openURL('https://twitter.com/qrledger')}>TWITTER</Text>
                <Text style={styles.secondMenuItems} onPress={() => Linking.openURL('https://www.reddit.com/r/qrl')}>REDDIT</Text>
                <Text style={styles.secondMenuItems} onPress={() => Linking.openURL('https://discord.gg/jBT6BEp')}>DISCORD</Text>
                <Text style={styles.secondMenuItems} onPress={() => Linking.openURL('mailto:support@theqrl.org') }>SUPPORT</Text>
            </View>
    	</ImageBackground>
    </View>
)


// The Stack for modals
const TxStack = StackNavigator(
  {
    TransactionsHistory : {
      path: '/',
      screen: TransactionsHistory
    },
    TxDetailsView : {
      path: '/',
      screen: TxDetailsView
    },
  },
  {
    headerMode: 'none',
  }
);


// MainDrawerMenu
const MainDrawerMenu = DrawerNavigator(
    {
      TransactionsHistory : {
        path: '/',
        screen: TxStack,
        navigationOptions: {
          drawerLabel: 'BALANCE',
          drawerIcon: ({ tintColor }) => (
            <Image source={require('./resources/images/transaction_history_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain}  style={styles.icon}/>
          ),
          // drawerLabel: 'Settings',
          // drawerIcon: ({ tintColor }) => <Icon name="cog" size={17} />,
        }
      },
        // TransactionsHistory : TxStack,
        SendReceive : {
            path: '/',
            screen: SendReceive
        },
        BackupWallet :{
            path: '/',
            screen: BackupWallet,
        },
        Wallets : {
            path: '/',
            screen: Wallets
        },
        Settings : {
          path: '/',
          screen: Settings
      },
    },
    {
      // initialRouteName: 'Wallet',
      initialRouteName: 'TransactionsHistory',
      drawerPosition: 'left',
      contentComponent: CustomDrawerContentComponent,
      contentOptions: {
        labelStyle: {
          color: 'white',
          fontSize: wp(3.3)
        },
        itemStyle:{
          height: hp(6)
        }
      }
    }
);

// The Stack for modals
const RootStack = StackNavigator(
  {
    MainDrawer: {
      screen: MainDrawerMenu,
      params: { test: "blaaa"},
    },
    ProvideWalletPin : {
      screen: ProvideWalletPin
    },
    OpenExistingWalletModal : {
      screen: OpenExistingWalletModal
    },
    ConfirmTxModal : {
      screen: ConfirmTxModal
    },
    DeleteWalletModal: {
      screen: DeleteWalletModal
    },
    UnlockAppModal: {
      screen: UnlockAppModal
    },
    // ScanQrModal : {
    //     screen: ScanQrModal
    // },
    ShowQrCodeModal : {
      screen: ShowQrCodeModal
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const AuthStack = StackNavigator(
  {
    SignIn: {
      screen: SignIn,
    },
    CreateWalletTreeHeight: {
      screen: CreateWalletTreeHeight,
    },
    CreateWalletHashFunction: {
      screen: CreateWalletHashFunction,
    },
    CreateAdvancedWallet: {
      screen: CreateAdvancedWallet,
    },
    CompleteSetup: {
      screen: CompleteSetup,
    },
    OpenExistingWalletWithHexseed: {
      screen: OpenExistingWalletWithHexseed,
    },
    OpenExistingWalletOptions: {
      screen: OpenExistingWalletOptions,
    },
    OpenExistingWalletWithMnemonic: {
      screen: OpenExistingWalletWithMnemonic,
    },
  },
  {
    initialRouteName: 'SignIn',
    headerMode: 'none'
  }
);

// const AuthStack = StackNavigator({ SignIn: CreateWallet });
export default SwitchNavigator(
  	{
		AuthLoading: AuthLoadingScreen,
		App: RootStack,
		Auth: AuthStack,
  	},
  	{
    	initialRouteName: 'AuthLoading',
  	}
);

// export default MainDrawerMenu
