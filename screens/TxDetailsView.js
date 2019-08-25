import React from 'react';
import {Text, View, Button, Image, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator, Linking} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import styles from './styles.js';

export default class txDetailsView extends React.Component {

    static navigationOptions = {
         drawerLabel: () => null
    };

    componentDidMount() {
        // Ios
        this.setState({isLoading:true})
        if (Platform.OS === 'ios'){

            this.setState({paddingBottom: 100, paddingTop: 40, marginTop:30})
            IosWallet.getTxDetails(this.props.navigation.state.params.txhash, (error, result)=> {
                // convert result to JSON
                var results = JSON.parse(result);
                this.setState({isLoading:false, blocknumber: results.blocknumber, nonce: results.nonce, fromAddr: results.from, toAddr: results.to, amount: results.amount});
            });
        }
        // Android
        else {
            this.setState({paddingBottom: 10, paddingTop: 10, marginTop:10})
            AndroidWallet.getTxDetails(this.props.navigation.state.params.txhash, (err) => {console.log(err);}, (result)=> {
                var results = JSON.parse(result);
                this.setState({isLoading:false, blocknumber: results.blocknumber, nonce: results.nonce, fromAddr: results.from, toAddr: results.to, amount: results.amount});
            });
        }
    }

    state={
        isLoading:true
    }

    // render view
    render() {
        // if (this.state.isLoading){
        //     return (
        //         <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
        //             <View style={{flex:1}}>
        //                 <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
        //                     <TouchableHighlight onPress={()=> this.props.navigation.navigate("TransactionsHistory")} underlayColor='white'>
        //                         <Image source={require('../resources/images/whiteArrowLeft.png')} resizeMode={'contain'} style={{height:25, width:25}} />
        //                     </TouchableHighlight>
        //                 </View>
        //                 <View style={{ height:130, width:360, borderRadius:10, alignSelf:'center', marginTop: 30}}>
        //                     <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage2}>
        //                         <View style={{flex:1, alignSelf:'center', width:360, justifyContent:'center', alignItems:'center'}}>
        //                             <Text style={{color:'white', fontSize:20}}>TRANSACTION DETAILS</Text>
        //                         </View>
        //                     </ImageBackground>
        //                 </View>
        //                 <View style={{flex:1, paddingTop: 50, paddingBottom:100, width:360, alignSelf: 'center',  borderRadius:10}}>
        //                     <View style={{height:50, backgroundColor:'white'}}>
        //                         <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
        //                             <Text style={{justifyContent:'center'}}>{this.props.navigation.state.params.txhash}</Text>
        //                         </View>
        //                     </View>
        //                     <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
        //                     <View style={{flex:2, backgroundColor:'white', width:360, padding:30, alignItems:'center'}}>
        //                         <View>
        //                             <Text>{this.props.navigation.state.params.txhash}</Text>
        //                             <Text>Loading...</Text>
        //                         </View>
        //                     </View>
        //                 </View>
        //             </View>
        //         </ImageBackground>
        //     );
        // }
        // else {
            amount = this.state.amount / 1000000000
            return (
                <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
                    <View style={{flex:1}}>

                        <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:this.state.paddingTop, paddingLeft:30}}>
                            <TouchableHighlight onPress={()=> this.props.navigation.navigate("TransactionsHistory")} underlayColor='#184477'>
                                <Image source={require('../resources/images/whiteArrowLeft.png')} resizeMode={'contain'} style={{height:25, width:25}} />
                            </TouchableHighlight>
                        </View>


                        <View style={{height: hp(20), marginTop: hp(3) , borderRadius:10, alignSelf:'center'}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage}>
                                <View style={{flex:1, alignSelf:'center', width: wp(96), justifyContent:'center', alignItems:'center'}}>
                                    <Text style={styles.sectionTitle}>TRANSACTION DETAILS</Text>
                                </View>
                            </ImageBackground>
                        </View>
                        
                        <View style={{ width:wp(93), height:hp(60), paddingBottom:100, alignSelf:'center',  borderRadius:10, backgroundColor:'white', padding: 20}}>
                            <View style={{flex:1, alignItems:'center'}}>
                                
                                <View style={styles.txDetailsBlock}>
                                    <Text style={styles.descriptionTextBlackBig}>Transfer</Text>
                                    <Text style={{color: '#184477',textAlign: 'center',fontSize: wp(5.5), fontWeight: 'bold'}}>{amount.toString()}</Text>
                                    <Text style={styles.descriptionTextBlack}>QUANTA</Text>
                                </View>

                                <View style={[styles.txDetailsBlock ,{paddingTop: wp(10)}] }>
                                    <Text style={styles.descriptionTextBlackBig}>From</Text>
                                    <Text selectable={true} style={styles.mediumTextBlack}>Q{this.state.fromAddr}</Text>
                                </View>

                                <View style={styles.txDetailsBlock}>
                                    <Text style={styles.descriptionTextBlackBig}>To</Text>
                                    <Text selectable={true} style={styles.mediumTextBlack}>Q{this.state.toAddr}</Text>
                                </View>

                                <View style={styles.txDetailsBlock}>
                                    <Text style={styles.descriptionTextBlackBig}>Transaction</Text>
                                    <Text style={styles.mediumTextBlack} selectable={true}>{this.props.navigation.state.params.txhash}</Text>
                                    <TouchableHighlight style={{padding: wp(3)}} onPress={ ()=> Linking.openURL('https://testnet-explorer.theqrl.org/tx/'+this.props.navigation.state.params.txhash) } underlayColor={'white'} >
                                        <Text style={{color: '#184477',textAlign: 'center',fontSize: wp(4), fontWeight: 'bold'}}>See on explorer</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>

                        </View>
                    </View>
                </ImageBackground>
            );
        // }
    }
}

// styling
// const styles = StyleSheet.create({
//     SubmitButtonStyle: {
//         alignSelf:'center',
//         width: 150,
//         marginTop:30,
//         paddingTop:15,
//         paddingBottom:15,
//         backgroundColor:'#f33160',
//         borderWidth: 1,
//         borderColor: '#fff'
//     },
//     TextStyle:{
//         color:'#fff',
//         textAlign:'center',
//     },
//     backgroundImage: {
//         flex: 1,
//         width: null,
//         height: null,
//     },
//     backgroundImage2: {
//         alignSelf: 'flex-start',
//         left: 0
//     },
// });
