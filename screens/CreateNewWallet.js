import React from 'react';
import {Platform, Text, View, Button, Image, StyleSheet, Modal, ImageBackground, TouchableOpacity, TouchableHighlight, AsyncStorage, ListView, ScrollView} from 'react-native';

export default class CreateNewWallet extends React.Component {

    // seetings for react-native navigation
    static navigationOptions = {
        drawerLabel: 'CREATE NEW WALLET',
        drawerIcon: ({ tintColor }) => (
            <Image
            source={require('../resources/images/wallet_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}
            />
        ),
    };

    // get the required information from asyncStorage
    componentWillMount(){
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        // get walletlist JSON
        AsyncStorage.getItem("walletlist").then((walletlist) => {
            // get walletindex (index of the opened wallet)
            AsyncStorage.getItem("walletindex").then((walletindex) => {
                this.setState({isLoading:false, walletindex: walletindex, dataSource: ds.cloneWithRows(JSON.parse(walletlist).reverse() )})
            }).catch((error) => {console.log(error)});
        }).catch((error) => {console.log(error)});
    }

    state={
        mnemonic: '',
        hexseed: '',
        isLoading: true,
        modalVisible: false,
        walletIndexToOpen: null
    }

    openHexseedModal = (walletindexToOpen) => {
        // this.setState({modalVisible: true, walletIndexToOpen: walletindexToOpen })
        this.props.navigation.navigate('OpenExistingWalletModal',{onGoBack: () => this.refreshWalletIndex(), walletIndexToOpen: walletindexToOpen})
    }


    // Close active wallet (remove all information from "cache") and open new one
    closeWallet = () => {
        this.setState({isLoading: true});
        this.props.navigation.navigate( 'Auth');
        AsyncStorage.removeItem("walletcreated");
    }


    // ListView for the
      renderRow(rowData, sectionID, rowID) {
          // format the QUANTA amount
          addressBegin = rowData.address.substring(1, 10);
          addressEnd = rowData.address.substring(68, 79);

          return (
              <View  style={{flex: 1, flexDirection:'row', alignSelf:'center', height:80, width:300}} onPress={()=> this.props.navigation.navigate('TxDetailsView', {txhash: txhash})} underlayColor='white'>

                  <View style={{justifyContent:'center'}}>
                      <Image
                        source={require('../resources/images/wallet_drawer_icon_light.png')} resizeMode={Image.resizeMode.contain} style={{width:25, height:25}}
                      />
                  </View>
                  <View style={{justifyContent:'center'}}>
                      <Text>    Q{addressBegin}...{addressEnd} </Text>
                  </View>
                  <View style={{flex:1, justifyContent:'center', alignItems:'flex-end'}}>
                      {this.state.walletindex == rowData.index ?
                          <Text style={{color:'green', fontSize:20}}>Active</Text>
                          :
                           <Button color="red" onPress={() => this.openHexseedModal(rowData.index)  } title="Open"/>
                      }
                    </View>
              </View>
            );
      }

      ListViewItemSeparator = () => {
        return (
          <View
            style={{height: .5,width: "90%",backgroundColor: "#000",alignSelf:'center'}}
          />
        );
      }

      // refresh wallet index on switch
      refreshWalletIndex(){
          // get walletindex (index of the opened wallet)
          this.setState({isLoading:true});
          AsyncStorage.getItem("walletindex").then((walletindex) => {
              this.setState({isLoading:false, walletindex: walletindex})
          }).catch((error) => {console.log(error)});
      }

  // render view
  render() {

      if (this.state.isLoading){
          return(<View><Text>Loading...</Text></View>)
      }
      else {
          return (
              <ImageBackground source={require('../resources/images/sendreceive_bg_half.png')} style={styles.backgroundImage}>
                <View style={{flex:1}}>
                    <View style={{alignItems:'flex-start', justifyContent:'flex-start', paddingTop:40, paddingLeft:30}}>
                        <TouchableHighlight onPress={()=> this.props.navigation.openDrawer()} underlayColor='white'>
                          <Image source={require('../resources/images/sandwich.png')} resizeMode={Image.resizeMode.contain} style={{height:25, width:25}} />
                        </TouchableHighlight>
                    </View>

                    <ScrollView style={{flex:2}}>
                        <View style={{ height:130, width:330, borderRadius:10, alignSelf:'center', marginTop: 30}}>
                            <ImageBackground source={require('../resources/images/backup_bg.png')} imageStyle={{resizeMode: 'contain'}} style={styles.backgroundImage2}>
                                <View style={{flex:1, alignSelf:'center', width:330, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{color:'white', fontSize:20}}>OPEN NEW WALLET</Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={{flex:1, paddingTop: 50, paddingBottom:100, width:330, alignSelf: 'center',  borderRadius:10}}>
                            <View style={{height:50, backgroundColor:'white'}}>
                                <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                                    <Text>New wallet creation</Text>
                                </View>
                            </View>
                            <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                            <View style={{ backgroundColor:'white', width:330, padding:30, alignItems:'center'}}>
                                <View>
                                    <Text>You are about to create a new wallet and close the existing one.</Text>
                                    <TouchableOpacity style={styles.SubmitButtonStyle} activeOpacity = { .5 } onPress={ this.closeWallet }>
                                        <Text style={styles.TextStyle}> CREATE </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{backgroundColor:"white"}}>
                                <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                                <View style={{height:50, backgroundColor:'white'}}>
                                    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#fafafa'}}>
                                        <Text>Open existing wallet</Text>
                                    </View>
                                </View>
                                <View style={{width:'100%',height:1, backgroundColor:'red', alignSelf:'flex-end'}}></View>
                                <ListView automaticallyAdjustContentInsets={false} dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} renderSeparator= {this.ListViewItemSeparator} enableEmptySections={true} />
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </ImageBackground>
          );
      }
  }

}


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
