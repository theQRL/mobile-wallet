import React from 'react';
import {Picker, Text, View, Button, Image, ScrollView, ImageBackground, StyleSheet,AsyncStorage, TouchableHighlight, TouchableOpacity,ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert} from 'react-native';
var validate = require('@theqrl/validate-qrl-address');
// Android and Ios native modules
import DeviceInfo from 'react-native-device-info';
// ios
import PINCode from '@haskkor/react-native-pincode'

export default class ProvideWalletPin extends React.Component {


    static navigationOptions = {
         drawerLabel: () => null
    };

    state={
        pin:null
    }

    render() {
        console.log("SHOWING PIN")
      return(
          <ImageBackground source={require('../resources/images/complete_setup_bg.png')} style={styles.backgroundImage}>
              <PINCode
                status={'choose'}

                storePin={(pin: string) => {
                    this.setState({pin:pin})
                }}

                bottomLeftComponent = {
                    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate("CompleteSetup", {treeHeight: this.props.navigation.state.params.treeHeight, signatureCounts: this.props.navigation.state.params.signatureCounts,  hashFunctionName: this.props.navigation.state.params.hashFunctionName, hashFunctionId: this.props.navigation.state.params.hashFunctionId, pin:null} ) } >
                            <Text style={{color:'white'}}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                }
                subtitleChoose = "to keep your QRL wallet secure"
                stylePinCodeColorSubtitle ="white"
                stylePinCodeColorTitle="white"
                colorPassword="white"
                numbersButtonOverlayColor="white"

                finishProcess = {() => this.props.navigation.navigate("CompleteSetup", {treeHeight: this.props.navigation.state.params.treeHeight, signatureCounts: this.props.navigation.state.params.signatureCounts,  hashFunctionName: this.props.navigation.state.params.hashFunctionName, hashFunctionId: this.props.navigation.state.params.hashFunctionId, pin:this.state.pin} ) }

              />
              </ImageBackground>
      )
    }

}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    }
});
