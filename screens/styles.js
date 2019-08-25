import { StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default StyleSheet.create({
    ////////////
    // IMAGES
    ////////////
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
    },
    icon: {
        width: wp(8),
        height: wp(7)
    },
    ////////////
    // TEXT
    ////////////
    descriptionText: {
        color: 'white',
        fontSize: wp(4)
    },
    descriptionTextBlack: {
        color: 'black',
        textAlign: 'center',
        fontSize: wp(4)
    },
    descriptionTextBlackBig: {
        color: 'black',
        textAlign: 'center',
        fontSize: wp(5)
    },
    smallTextBlack: {
        color: 'black',
        textAlign: 'center',
        fontSize: wp(3)
    },
    mediumTextBlack: {
        color: 'black',
        textAlign: 'center',
        fontSize: wp(3.5)
    },
    bigTitle:{
        color:'white',
        fontSize: wp(5),
    },
    bigTitleBlack:{
        color:'black',
        fontSize: wp(5),
    },
    TextStyleWhite:{
        fontSize: wp(4),
        color:'white',
        textAlign:'center',
    },
    TextStyle:{
        fontSize: wp(4),
        color:'#1e79cb',
        textAlign:'center',
    },
    TextStyleBlack:{
        fontSize: wp(4),
        color:'black',
    },
    TextStyleWhite:{
        fontSize: wp(4),
        color:'white',
        textAlign:'center',
    },
    smallTitle:{
        color:'white', 
        fontSize: wp(5), 
        marginTop:10
    },
    smallTitleBlack:{
        color:'black', 
        fontSize: wp(5), 
        marginTop:10
    },
    selectionText:{
        fontSize: wp(4),
        color: '#1e79cb',
    },
    sectionTitle:{
        color:'white', 
        fontSize: wp(5)
    },
    ////////////
    // BUTTONS
    ////////////
    SubmitButtonStyle: {
        width: wp(85),
        height: hp(6),
        marginTop: hp(1),
        marginBottom: hp(1),
        justifyContent: 'center',
        backgroundColor:'white',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff'
    },
    SubmitButtonStyleRed: {
        width: wp(85),
        height: hp(6),
        marginTop: hp(1),
        marginBottom: hp(1),
        justifyContent: 'center',
        backgroundColor:'#f33160',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#f33160'
    },
    SubmitButtonStyleBlue: {
        width: wp(85),
        height: hp(6),
        marginTop: hp(1),
        marginBottom: hp(1),
        justifyContent: 'center',
        backgroundColor:'#144b82',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#144b82'
    },
    SubmitButtonStyleRedSmall: {
        width: wp(65),
        height: hp(6),
        marginTop: hp(1),
        marginBottom: hp(1),
        justifyContent: 'center',
        backgroundColor:'#f33160',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#f33160'
    },
    SubmitButtonStyleBlueSmall: {
        width: wp(65),
        height: hp(6),
        marginTop: hp(1),
        marginBottom: hp(1),
        justifyContent: 'center',
        backgroundColor:'#144b82',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#144b82'
    },
    hexInput:{
        backgroundColor:'#ebe8e8',
        height:hp(6),
        width: wp(85),
        borderRadius:10,
        marginTop:15
    },
    selection: {
        width: wp(85),
        height: hp(6),
        alignItems: 'center',
        alignSelf:'center',
        justifyContent:'center',
    },
    selection2: {
        backgroundColor:'#f6f6f6',
        width: wp(85),
        height: hp(6),
        alignSelf:'center',
        alignItems: 'center',
        justifyContent:'center',
    },
    ////////////
    // MENU
    ////////////
    secondMenu:{
        paddingLeft: wp(8), 
        paddingTop: hp(3)
    },
    secondMenuItems: {
        fontSize: wp(3),
        color: 'white',
        paddingTop: hp(2)
    },

    SectionStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ebe8e8',
        height: hp(6),
        borderRadius: 10,
        // margin: 10,
        width: wp(80)
    },
     
    ImageStyle: {
        padding: 10,
        margin: 5,
        height: 25,
        width: 25,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    txDetailsBlock: {
        flex:1,
        paddingTop: wp(5),
        textAlign: 'center',
        alignItems: 'center'
    }
});