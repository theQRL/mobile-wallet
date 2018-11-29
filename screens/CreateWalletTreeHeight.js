import React, { Component } from 'react';
import {Platform,StyleSheet,ImageBackground,Text,View,Modal,TouchableOpacity,TouchableHighlight} from 'react-native';

export default class CreateWalletTreeHeight extends React.Component {

    static navigationOptions = {
        headerMode: 'none'
    };

    state={
        treeHeight: "0",
        signatureCounts : "0",
        dimensions : undefined,
        y1:0,
        y2:0,
        y3:0,
        showModal: false,
        selectText : undefined
    }

    // show modal to select tree height
    showModal = () => {
        if (Platform.OS === 'ios'){
            var y3 = this.state.y1 + this.state.y2 - 200
            this.setState({y3: y3, showModal: true})
        }
        else {
            var y3 = this.state.y1_android - this.state.y2_android
            this.setState({y3: y3, showModal: true})
        }
    }

    // update tree height according to user's selection
    updateHeight = (height) => {
        this.setState({treeHeight:height, showModal:false});
        if (height== 8){this.setState({selectText:"HEIGHT 8: SIGNATURES 256", signatureCounts: 256})}
        if (height== 10){this.setState({selectText:"HEIGHT 10: SIGNATURES 1,024", signatureCounts: 1024})}
        if (height== 12){this.setState({selectText:"HEIGHT 12: SIGNATURES 4,096", signatureCounts: 4096})}
        if (height== 14){this.setState({selectText:"HEIGHT 14: SIGNATURES 16,384", signatureCounts: 16384})}
        if (height== 16){this.setState({selectText:"HEIGHT 16: SIGNATURES 262,144", signatureCounts: 262144})}
    }

    render() {
        return (
            <ImageBackground source={require('../resources/images/signin_process_treeheight_bg.png')} style={styles.backgroundImage}>
                <Modal visible={this.state.showModal} transparent={true}>
                    <View style={{borderRadius:10, alignItems:'center', alignSelf:'center', justifyContent:'center',backgroundColor:'white', top:this.state.y3, left:this.state.modalx, width:300, position:'absolute'}}>
                        <TouchableHighlight style={styles.selection} onPress={() => this.updateHeight(8)}>
                            <Text style={styles.selectionText}>HEIGHT 8: SIGNATURES 256</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.selection2} onPress={() => this.updateHeight(10)}>
                            <Text style={styles.selectionText}>HEIGHT 10: SIGNATURES 1,024</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.selection} onPress={() => this.updateHeight(12)}>
                            <Text style={styles.selectionText}>HEIGHT 12: SIGNATURES 4,096</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.selection2} onPress={() => this.updateHeight(14)}>
                            <Text style={styles.selectionText}>HEIGHT 14: SIGNATURES 16,384</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.selection} onPress={() => this.updateHeight(16)}>
                            <Text style={styles.selectionText}>HEIGHT 16: SIGNATURES 262,144</Text>
                        </TouchableHighlight>
                    </View>
                </Modal>

                <View style={{flex:1}}></View>
                <View style={{flex:1, alignItems:'center'}} ref='Marker2' onLayout={({nativeEvent}) => {this.refs.Marker2.measure((x, y, width, height, pageX, pageY) => {this.setState({y1:y, y1_android:height});}) }}>
                    <Text>SET UP YOUR WALLET</Text>
                    <Text style={styles.bigTitle}>TREE HEIGHT</Text>
                    <View style={{width:100, height:1, backgroundColor:'white', marginTop:30,marginBottom:20}}></View>
                    <Text style={{color:'white'}}><Text style={{textDecorationLine:'underline'}}>Important:</Text> Once you run out of signatures you</Text>
                    <Text style={{color:'white'}}>will need to create a new wallet.</Text>
                    <Text style={{color:'white'}}>Be aware that wallet creation time increases</Text>
                    <Text style={{color:'white'}}>with wallet height.</Text>

                    {Platform.OS === 'ios' ?
                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.showModal} ref='Marker' onLayout={({nativeEvent}) => {
                        this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {this.setState({y2:y, modalx:x, y2_android: height}); })}} >
                            {this.state.selectText ? 
                                <Text style={styles.TextStyle}> {this.state.selectText} </Text>
                                : 
                                <Text style={styles.TextStyle}> CHOOSE A TREE HEIGHT </Text> 
                            }
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={this.showModal} ref='Marker' onLayout={({nativeEvent}) => {
                        this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {this.setState({y2:y, modalx:pageX, y2_android: height}); })}} >
                            {this.state.selectText ? 
                                <Text style={styles.TextStyle}> {this.state.selectText} </Text>
                                : 
                                <Text style={styles.TextStyle}> CHOOSE A TREE HEIGHT </Text> 
                            }
                        </TouchableOpacity>
                    }
                    {this.state.selectText ?  
                        <TouchableOpacity style={styles.SubmitButtonStyleDark} activeOpacity = { .5 } onPress={() => this.props.navigation.navigate('CreateWalletHashFunction',{treeHeight: this.state.treeHeight, signatureCounts: this.state.signatureCounts}) } >
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
