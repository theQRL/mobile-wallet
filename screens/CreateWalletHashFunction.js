import React, { Component } from 'react';
import {Platform,StyleSheet,ImageBackground,Text,View,Image,Modal,Button,TouchableOpacity,TouchableHighlight} from 'react-native';

export default class CreateWalletHashFunction extends React.Component {

    static navigationOptions = {
        headerMode: 'none'
    };

    state={
        hashFunction: '0',
        hashFunctionName:"",
        dimensions : undefined,
        y1:0,
        y2:0,
        y3:0,
        showModal: false,
        selectText : undefined
    }

    // show modal to select hash function
    showModal = () => {
        if (Platform.OS === 'ios'){
            var y3 = this.state.y1 + this.state.y2 - 100
            this.setState({y3: y3, showModal: true})
        }
        else {
            var y3 = this.state.y1_android - this.state.y2_android + 85
            this.setState({y3: y3, showModal: true})
        }
    }

    // update hash function according to user's selection
    updateHashFunction = (hashFunction) => {
        this.setState({hashFunction: hashFunction, showModal:false});
        if (hashFunction== 1){this.setState({selectText:"HASH FUNCTION: SHAKE_128", hashFunctionName:"SHAKE_128"})}
        if (hashFunction== 2){this.setState({selectText:"HASH FUNCTION: SHAKE_256", hashFunctionName:"SHAKE_256"})}
        if (hashFunction== 3){this.setState({selectText:"HASH FUNCTION: SHA2_256", hashFunctionName:"SHA2_256"})}
    }

    render() {
        return (
            <ImageBackground source={require('../resources/images/signin_process_hashfunction_bg.png')} style={styles.backgroundImage}>

                <Modal visible={this.state.showModal} transparent={true}>
                    <View style={{borderRadius:10, alignItems:'center', alignSelf:'center', justifyContent:'center',backgroundColor:'white', top:this.state.y3, left:this.state.modalx, width:300, position:'absolute'}}>
                        <TouchableHighlight style={styles.selection} onPress={() => this.updateHashFunction(1)}>
                            <Text style={styles.selectionText}>HASH FUNCTION: SHAKE_128</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.selection2} onPress={() => this.updateHashFunction(2)}>
                            <Text style={styles.selectionText}>HASH FUNCTION: SHAKE_256</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.selection} onPress={() => this.updateHashFunction(3)}>
                            <Text style={styles.selectionText}>HASH FUNCTION: SHA2_256</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>

                <View style={{flex:1}}>
                </View>
                <View style={{flex:1, alignItems:'center'}} ref='Marker2' onLayout={({nativeEvent}) => {this.refs.Marker2.measure((x, y, width, height, pageX, pageY) => {this.setState({y1:y, y1_android: height});}) }}>
                    <Text>SET UP YOUR WALLET</Text>
                    <Text style={styles.bigTitle}>HASH FUNCTION</Text>
                    <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                    <Text style={{color:'white'}}>Select your preferred hash function</Text>

                    {Platform.OS === 'ios' ?
                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.showModal} ref='Marker' onLayout={({nativeEvent}) => {
                        this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {this.setState({y2:y, modalx:x});})}}>
                            {this.state.selectText ? 
                                <Text style={styles.TextStyle}> {this.state.selectText} </Text>
                                : 
                                <Text style={styles.TextStyle}> CHOOSE A HASH FUNCTION </Text> 
                            }
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.showModal} ref='Marker' onLayout={({nativeEvent}) => {
                        this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {this.setState({y2:y, modalx:pageX, y2_android: height});})}}>
                            {this.state.selectText ? 
                                <Text style={styles.TextStyle}> {this.state.selectText} </Text>
                                : 
                                <Text style={styles.TextStyle}> CHOOSE A HASH FUNCTION </Text> 
                            }
                        </TouchableOpacity>

                    }
                    {this.state.selectText ?  
                        <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={ () =>  this.props.navigation.navigate('CompleteSetup',{treeHeight: this.props.navigation.state.params.treeHeight, signatureCounts: this.props.navigation.state.params.signatureCounts,  hashFunctionName: this.state.hashFunctionName, hashFunctionId: this.state.hashFunction}) }>
                            <Text style={styles.TextStyleWhite}> CONTINUE </Text>
                        </TouchableOpacity>
                        : 
                        undefined 
                    }
                </View>
            </ImageBackground>
        );
    }
}

// styling
const styles = StyleSheet.create({
    selectionText:{
        color: '#1e79cb',
    },
    selection: {
        width:300,
        height:50,
        alignSelf:'center',
        justifyContent:'center',
        paddingLeft:50,
    },
    selection2: {
        backgroundColor:'#f6f6f6',
        width:300,
        height:50,
        alignSelf:'center',
        justifyContent:'center',
        paddingLeft:50,
    },
    bigTitle:{
        color:'white',
        fontSize: 25,
    },
    SubmitButtonStyle: {
        width: 300,
        height:50,
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'white',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyleDark: {
        width: 300,
        marginTop:10,
        paddingTop:15,
        paddingBottom:15,
        marginLeft:30,
        marginRight:30,
        backgroundColor:'#144b82',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#144b82'
    },
    TextStyle:{
        color:'#1e79cb',
        textAlign:'center',
    },
    TextStyleWhite:{
        color:'white',
        textAlign:'center',
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
});
