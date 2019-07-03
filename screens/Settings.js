import React from 'react';
import {Text, View, TextInput, Image, ImageBackground, AsyncStorage, StyleSheet, TouchableHighlight, TouchableOpacity, Platform, ActivityIndicator, Modal} from 'react-native';

import {NativeModules} from 'react-native';
var IosWallet = NativeModules.refreshWallet;
var AndroidWallet = NativeModules.AndroidWallet;

export default class Settings extends React.Component {

    static navigationOptions = {
        drawerLabel: 'SETTINGS',
        drawerIcon: ({ tintColor }) => (
            <Image source={require('../resources/images/icon_settings.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}/>
        ),
    };

    componentDidMount(){

        AsyncStorage.multiGet(["nodeUrl", "nodePort"]).then(storageResponse => {
            this.setState({nodeUrl: storageResponse[0][1], nodePort: storageResponse[1][1], loading: false});    
        });

    }

    state={
        loading: true,
    }


    onUrlChange = (text) => {
        this.setState({nodeUrl: text})
    }

    onPortChange = (text) => {
        this.setState({nodePort: text})
    }

    // update the node and port information on AsyncStorage as well as Android and iOS native code
    saveSettings = () => {
        console.log("")
        if (Platform.OS === 'ios'){
            IosWallet.saveNodeInformation( this.state.nodeUrl, this.state.nodePort, (error, status)=> {
                if (status == "saved"){
                    // Alert SUCCESS
                  AsyncStorage.setItem("nodeUrl", this.state.nodeUrl);
                  AsyncStorage.setItem("nodePort", this.state.nodePort);
                }
            });    
        }
        else {
            AndroidWallet.saveNodeInformation(this.state.nodeUrl, this.state.nodePort,  (err) => {console.log(err);}, (status)=> {
                if (status == "saved"){
                    // Alert SUCCESS
                  AsyncStorage.setItem("nodeUrl", this.state.nodeUrl);
                  AsyncStorage.setItem("nodePort", this.state.nodePort);
                }
            });
        }
    }

    // render view
    render() {
        if (this.state.loading){
            return(
                <View></View>
            )
        }
        else {
            return (
                <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>                
                <View style={{flex:1}}>
    
                    <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                        <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='#184477'>
                            <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                        </TouchableHighlight>
                    </View>
                    <View style={{ height:130, width:330, borderRadius:10, alignSelf:'center', marginTop: 30}}>
                        <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage2}>
                            <View style={{flex:1, alignSelf:'center', width:330, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize:20}}>SETTINGS</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{flex:1, paddingTop: 50, paddingBottom:100, width:330, alignSelf: 'center',  borderRadius:10}}>
                        <Text>NODE URL</Text>
                        <TextInput onChangeText={ (text) => this.onUrlChange(text) } value={this.state.nodeUrl} style={{backgroundColor:'#ebe8e8', height:50}} />
                        <Text>{'\n'}PORT</Text>
                        <TextInput keyboardType={'numeric'} onChangeText={ (text) => this.onPortChange(text) } value={this.state.nodePort} style={{backgroundColor:'#ebe8e8', height:50}} />


                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ () => { this.saveSettings() }}>
                            <Text style={styles.TextStyle}> SAVE </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            );
        }
    }
}

// styling
const styles = StyleSheet.create({
    SubmitButtonStyle: {
        alignSelf:'center',
        width: 150,
        marginTop:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#f33160',
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyleSmall: {
        alignSelf:'center',
        width: 130,
        marginTop:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#f33160',
        borderWidth: 1,
        borderColor: '#fff',
        marginRight: 10,
        marginLeft: 10
    },
    SubmitButtonStyleSmallBlue: {
        alignSelf:'center',
        width: 130,
        marginTop:30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor:'#144b82',
        borderWidth: 1,
        borderColor: '#fff',
        marginRight: 10,
        marginLeft: 10
    },
    TextStyle:{
        color:'#fff',
        textAlign:'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    backgroundImage2: {
        alignSelf: 'flex-start',
        left: 0
    },
});
