import React from 'react';
import {Text, View, Button, Image, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';
import styles from './styles.js';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import QRCode from 'react-native-qrcode';
import { widthPercentageToDP } from 'react-native-responsive-screen';
export default class ShowQrCodeModal extends React.Component {

    static navigationOptions = {
         drawerLabel: () => null
    };

    render() {
        return(
            <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
                <View style={{flex:1}}>
                    <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}></View>

                    <View style={{flex:2}}>
                        <View style={{ height:hp(20), borderRadius:10, alignSelf:'center', marginTop: 50}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                <View style={{flex:1, alignSelf:'center', width:wp(96), justifyContent:'center', alignItems:'center'}}>
                                    <Text style={styles.sectionTitle}>QR code</Text>
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={{flex:1, paddingTop: 10, marginBottom:40, width:wp(93), alignSelf: 'center',  borderRadius:10, backgroundColor:'white'}}>
                            <View style={{paddingTop:10, alignItems:'center', justifyContent:'center', paddingRight:10, paddingLeft:10}}>
                                <Text style={{fontWeight: "bold"}}>QRL wallet address</Text>
                                <Text style={{textAlign: 'center'}} selectable={true}>{this.props.navigation.state.params.qrcode}</Text>
                            </View>

                            <View style={{ flex: 5, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                <QRCode value={this.props.navigation.state.params.qrcode} size={wp(50)} bgColor='black' fgColor='white'/>
                            </View>

                            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                <TouchableOpacity style={styles.SubmitButtonStyleRedSmall} activeOpacity = { .5 } onPress={() => this.props.navigation.goBack()} >
                                    <Text style={styles.TextStyleWhite}> DISMISS </Text>
                                </TouchableOpacity>

                                {/* <TouchableHighlight onPress={() => this.props.navigation.goBack()  } >
                                    <Text style={{color:'red'}}>Dismiss</Text>
                                </TouchableHighlight> */}
                            </View>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
