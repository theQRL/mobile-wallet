import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

// View for scanning QR code of QRL address
export default class ScanQrModal extends React.Component {

    static navigationOptions = {
         drawerLabel: () => null
    };

    showQRLaddress(e){
        this.props.navigation.navigate("SendReceive",{recipient: e.data});
    }

    render() {
      return(
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <QRCodeScanner onRead={this.showQRLaddress.bind(this)}
                topContent={
                    <Text style={styles.centerText}>
                        Scan QRL wallet QR code
                    </Text>
                }
                bottomContent={
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("SendReceive")} >
                        <Text style={styles.CancelTextStyle}>Dismiss</Text>
                    </TouchableOpacity>
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
        paddingTop: 80,
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
  CancelTextStyle:{
      alignSelf:'center',
      color: 'red',
      textAlign:'center',
      fontSize:18,
      paddingTop:5
  },
});
