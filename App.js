
import React, { Component } from 'react';
import { Button, Text, ImageBackground, ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View, Image, Linking } from 'react-native';
import { DrawerNavigator , StackNavigator, SwitchNavigator, DrawerItems } from 'react-navigation'; // Version can be specified in package.json
// Import the different screens
import BackupWallet from './screens/BackupWallet'
import SendReceive from './screens/SendReceive'
import TransactionsHistory from './screens/TransactionsHistory'
import CreateNewWallet from './screens/CreateNewWallet'
import CompleteSetup from './screens/CompleteSetup'
import OpenExistingWallet from './screens/OpenExistingWallet'
import SignIn from './screens/SignIn'
import CreateWalletTreeHeight from './screens/CreateWalletTreeHeight'
import CreateWalletHashFunction from './screens/CreateWalletHashFunction'
import ScanQrModal from './screens/ScanQrModal'
import ConfirmTxModal from './screens/ConfirmTxModal'
import CreateAdvancedWallet from './screens/CreateAdvancedWallet'
import TxDetailsView from './screens/TxDetailsView'
import ProvideWalletPin from './screens/ProvideWalletPin'
import OpenExistingWalletModal from './screens/OpenExistingWalletModal'
import ShowQrCodeModal from './screens/ShowQrCodeModal'

// import { QRLLIB } from './node_modules/qrllib/build/web-libjsqrl.js'

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
		const walletCreated = await AsyncStorage.getItem('walletcreated');
		// This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
		this.props.navigation.navigate(walletCreated ? 'App' : 'Auth');
	};

	// Render any loading content that you like here
	render() {
		return (
			<View>
				<ActivityIndicator />
			</View>
		);
	}
}

const CustomDrawerContentComponent = (props) => (
    <View style={{flex:1, backgroundColor:'#164278', paddingTop:50}}>
        <Image style={{height:80, width:80, alignSelf:'center'}} resizeMode={Image.resizeMode.contain}  source={require('./resources/images/qrl_logo_wallet.png')} />
        <View style={{paddingTop:50}}>
            <DrawerItems {...props}/>
        </View>
        <ImageBackground source={require('./resources/images/lower_drawer_bg.png')} style={{flex:1, height:null, width:null}}>
            <View style={{paddingLeft: 40, paddingTop:50}}>
                <Text style={{color:'white',paddingTop:20}} onPress={() => Linking.openURL('https://theqrl.org/')}>QRL WEBSITE</Text>
                <Text style={{color:'white',paddingTop:20}} onPress={() => Linking.openURL('https://qrl.foundation/')}>QRL FOUNDATION</Text>
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
        TransactionsHistory : {
            path: '/',
            screen: TransactionsHistory
        },
        SendReceive : {
            path: '/',
            screen: SendReceive
        },
        BackupWallet :{
            path: '/',
            screen: BackupWallet,
        },
        CreateNewWallet : {
            path: '/',
            screen: CreateNewWallet
        },
        TxDetailsView : {
            path: '/',
            screen: TxDetailsView
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
            }
        }
    }
);

// The Stack for modals
const RootStack = StackNavigator(
  {
    MainDrawer: {
      screen: MainDrawerMenu,
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
    ScanQrModal : {
        screen: ScanQrModal
    },
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
    OpenExistingWallet: {
      screen: OpenExistingWallet,
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
