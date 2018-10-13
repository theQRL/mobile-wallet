import React from 'react';
import {Text, View, Button, Image} from 'react-native';

export default class CreateNewWallet extends React.Component {
  static navigationOptions = {
    drawerLabel: 'CREATE NEW WALLET',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../resources/images/wallet_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain} style={{width:30, height:30}}
      />
    ),
  };

  render() {
    return (
        <View>
        <Text>below</Text>
        <Text>Explorer</Text>
        <Button onPress={()=> this.props.navigation.openDrawer()} title="Open drawer"/>
        </View>
    );
  }
}
