import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

export default class ScanQrModal extends React.Component {




    showQRLaddress(e){
        console.log(e.data);
        this.props.navigation.navigate("SendReceive",{recipient: e.data});
    }


    render() {

      return(

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>


    <QRCodeScanner
  onRead={this.showQRLaddress.bind(this)}
  topContent={
    <Text style={styles.centerText}>
        Scan QRL wallet QR code
    </Text>
  }
  bottomContent={
      <Button onPress={() => this.props.navigation.navigate("SendReceive")} title="Dismiss"/>
  }
/>




          </View>
      )
    }

}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    paddingTop: 100,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
