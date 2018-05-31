import React from 'react';
import {Text, View, Button, Image} from 'react-native';

export default class Scan extends React.Component {
  static navigationOptions = {
    drawerLabel: 'SCAN',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../resources/images/scan_drawer_icon.png')} resizeMode={Image.resizeMode.contain} style={{width:30, height:30}}
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
