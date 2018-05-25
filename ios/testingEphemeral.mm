////
////  testingEphemeral.m
////  theQRL
////
////  Created by abilican on 27.02.18.
////  Copyright © 2018 Facebook. All rights reserved.
////
//
//#import <Foundation/Foundation.h>
//#import "KyberIos.h"
//#import "testingEphemeral.h"
//#import <GRPCClient/GRPCCall+ChannelArg.h>
//#import <GRPCClient/GRPCCall+Tests.h>
//#import <theQRL/Qrl.pbrpc.h>
//#import <kyber.h>
//#import "dilithium.h"
//#import "xmss.h"
//#import "xmssBase.h"
//#import "xmssFast.h"
//#import "misc.h"
//
//@implementation testingEphemeral
//
//static NSString *const kConstant = @"myconstant";
//
//
//
//// ADD SENDER AND RECEIVER SEED AND PK/SK
//
//
//
//static NSString * const kHostAddress = @"104.251.219.215:9009";
//
//+ (void) getObject{
//  // Registering the lattice to the nodes
//  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
//  [GRPCCall setUserAgentPrefix:@"HelloWorld/1.0" forHost:kHostAddress];
//  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
//
//  GetObjectReq *getobj = [GetObjectReq message];
//  NSString * str =@"\3555v\257U\374\203\224\266\257\234\235\366\254\325\005j\272Yx\276~\353\256j\t\024/!\341f\005";
//  getobj.query = [str dataUsingEncoding:1];
//
//  NSLog(@"Getting tx information...");
//  [client getObjectWithRequest:getobj handler:^(GetObjectResp *response, NSError *error) {
//    NSLog(@"REPONSE: %@", response);
//  }];
//}
//
//+ (void) registerLattice{
//
//
////  NSString *receiver_address = @"01060040d80a9da74b1b85eae8d56ff9b71823360433c0a5f554e84831322376fe86144dec863e";
////  std::string receiver_add = std::string([receiver_address UTF8String]);
////  std::vector<unsigned char> receiver_add_bin = hstr2bin(receiver_add);
////  NSLog(@"%hhu", receiver_add_bin[0]);
////  NSLog(@"%hhu", receiver_add_bin[1]);
////  NSLog(@"%hhu", receiver_add_bin[2]);
////  NSLog(@"%hhu", receiver_add_bin[3]);
////  NSLog(@"%hhu", receiver_add_bin[4]);
////  NSLog(@"%hhu", receiver_add_bin[5]);
//
//  // CREATING SENDER
//  NSLog(@"Creating sender...");
//  // wallet
//  NSData *sender_walletAddress = [@"01060040d80a9da74b1b85eae8d56ff9b71823360433c0a5f554e84831322376fe86144dec863e" dataUsingEncoding:NSUTF8StringEncoding];
//  // DILITHIUM
//  NSMutableArray *sender_dilithiumPK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < sender_dilithiumPK_uint.size(); i++) {
//    [sender_dilithiumPK_mutable_array addObject:@(sender_dilithiumPK_uint[i])];
//  }
//  NSData *sender_dilithiumPK = [NSKeyedArchiver archivedDataWithRootObject:sender_dilithiumPK_mutable_array];
//
//  NSMutableArray *sender_dilithiumSK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < sender_dilithiumSK_uint.size(); i++) {
//    [sender_dilithiumSK_mutable_array addObject:@(sender_dilithiumSK_uint[i])];
//  }
//  NSData *sender_dilithiumSK = [NSKeyedArchiver archivedDataWithRootObject:sender_dilithiumSK_mutable_array];
//
//  // KYBER
//  NSMutableArray *sender_kyberPK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < sender_kyberPK_uint.size(); i++) {
//    [sender_kyberPK_mutable_array addObject:@(sender_kyberPK_uint[i])];
//  }
//  NSData *sender_kyberPK = [NSKeyedArchiver archivedDataWithRootObject:sender_kyberPK_mutable_array];
//
//  NSMutableArray *sender_kyberSK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < sender_kyberSK_uint.size(); i++) {
//    [sender_kyberSK_mutable_array addObject:@(sender_kyberSK_uint[i])];
//  }
//  NSData *sender_kyberSK = [NSKeyedArchiver archivedDataWithRootObject:sender_kyberSK_mutable_array];
//
//  XmssFast sender_xmss(sender_SEED, 12);
//  // Converting xmssPK to NSData
//  NSMutableArray *sender_xmssPkArray = [[NSMutableArray alloc] init];
//  for (int i=0; i < sender_xmss.getPK().size(); i++) {
//    [sender_xmssPkArray addObject:@(sender_xmss.getPK()[i]) ];
//  }
//  NSData *sender_xmssPkData = [NSKeyedArchiver archivedDataWithRootObject:sender_xmssPkArray];
//
//
//  // CREATING RECEIVER
//  NSLog(@"Creating receiver...");
//  // wallet
//  NSData *receiver_walletAddress = [@"010600b331d9b709569a6799b658612f456caa0246bcdbedbbdd4dbff383209fadcd4554c92111" dataUsingEncoding:NSUTF8StringEncoding];
//  // Lattice
//  NSMutableArray *receiver_dilithiumPK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < receiver_dilithiumPK_uint.size(); i++) {
//    [receiver_dilithiumPK_mutable_array addObject:@(receiver_dilithiumPK_uint[i])];
//  }
//  NSData *receiver_dilithiumPK = [NSKeyedArchiver archivedDataWithRootObject:receiver_dilithiumPK_mutable_array];
//
//  NSMutableArray *receiver_dilithiumSK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < receiver_dilithiumSK_uint.size(); i++) {
//    [receiver_dilithiumSK_mutable_array addObject:@(receiver_dilithiumSK_uint[i])];
//  }
//  NSData *receiver_dilithiumSK = [NSKeyedArchiver archivedDataWithRootObject:receiver_dilithiumSK_mutable_array];
//
//  // KYBER
//  NSMutableArray *receiver_kyberPK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < receiver_kyberPK_uint.size(); i++) {
//    [receiver_kyberPK_mutable_array addObject:@(receiver_kyberPK_uint[i])];
//  }
//  NSData *receiver_kyberPK = [NSKeyedArchiver archivedDataWithRootObject:receiver_kyberPK_mutable_array];
//
//  NSMutableArray *receiver_kyberSK_mutable_array = [[NSMutableArray alloc] init];
//  for (unsigned i=0; i < receiver_kyberSK_uint.size(); i++) {
//    [receiver_kyberSK_mutable_array addObject:@(receiver_kyberSK_uint[i])];
//  }
//  NSData *receiver_kyberSK = [NSKeyedArchiver archivedDataWithRootObject:receiver_kyberSK_mutable_array];
//
//  XmssFast receiver_xmss(receiver_SEED, 12);
//  // Converting xmssPK to NSData
//  NSMutableArray *receiver_xmssPkArray = [[NSMutableArray alloc] init];
//  for (int i=0; i < receiver_xmss.getPK().size(); i++) {
//    [receiver_xmssPkArray addObject:@(receiver_xmss.getPK()[i]) ];
//  }
//  NSData *receiver_xmssPkData = [NSKeyedArchiver archivedDataWithRootObject:receiver_xmssPkArray];
//
//
//  auto sender_kyber = Kyber(sender_kyberPK_uint, sender_kyberSK_uint);
//  auto receiver_kyber = Kyber(receiver_kyberPK_uint, receiver_kyberSK_uint);
//  sender_kyber.kem_encode(receiver_kyberPK_uint);
//  auto enc_aes256_symkey = sender_kyber.getCypherText();
//  auto aes_symkey = sender_kyber.getMyKey();
//
//  ////////////////////
//  // 1 - Creating LatticePublicKeyTxnReq
//  ////////////////////
//  // SENDER
//  LatticePublicKeyTxnReq *sender_transaction= [LatticePublicKeyTxnReq message];
//  sender_transaction.addressFrom = sender_walletAddress;
//  sender_transaction.kyberPk = sender_kyberSK;
//  sender_transaction.dilithiumPk = sender_dilithiumPK;
//  sender_transaction.fee = 0;
//  sender_transaction.xmssPk = sender_xmssPkData;
//
//  // RECEIVER
//  LatticePublicKeyTxnReq *receiver_transaction= [LatticePublicKeyTxnReq message];
//  receiver_transaction.addressFrom = receiver_walletAddress;
//  receiver_transaction.kyberPk = receiver_kyberSK;
//  receiver_transaction.dilithiumPk = receiver_dilithiumPK;
//  receiver_transaction.fee = 0;
//  receiver_transaction.xmssPk = receiver_xmssPkData;
//
//
//  // Registering the lattice to the nodes
//  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
//  [GRPCCall setUserAgentPrefix:@"HelloWorld/1.0" forHost:kHostAddress];
//  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
//
//
//
//  // RECEIVER
//  NSLog(@"Registering Receiver Lattice...");
//  [client getLatticePublicKeyTxnWithRequest:receiver_transaction handler:^(TransferCoinsResp *response, NSError *error) {
//
//    NSLog(@"%@",response);
//
//    Transaction *trans = [Transaction message];
//
//    // I have to sign sha256(addr_from + str(fee).encode() + kyber_pk + dilithium_pk)
//
//    NSString *myString = [response.transactionUnsigned.transactionHash base64EncodedStringWithOptions:0];
//
//
//
//    std::string message = std::string([myString UTF8String]);
//    std::vector<unsigned char> hashToSign(message.begin(), message.end());
//
//    QRLDescriptor *desc;
////    NSLog(@"%@",desc->QRLDescriptor(1, 6, 0));
//
//    XmssFast receiver_xmss(receiver_SEED, 12);
//    auto signature = receiver_xmss.sign(hashToSign);
//
//    // converting signature to NSData
//    NSMutableArray *signature_array = [[NSMutableArray alloc] init];
//    for (int i=0; i < signature.size(); i++) {
//      [signature_array addObject:[NSString stringWithFormat: @"%d", signature[i]] ];
//    }
//    NSData *signature_data = [NSKeyedArchiver archivedDataWithRootObject:signature_array];
//
//    trans.signature = signature_data;
//    trans.addrFrom = response.transactionUnsigned.addrFrom;
//    trans.publicKey = response.transactionUnsigned.publicKey;
//    trans.transactionHash = response.transactionUnsigned.transactionHash;
//    trans.fee = 0;
//    trans.nonce = 0;
//    trans.latticePk = response.transactionUnsigned.latticePk;
//
//    PushTransactionReq *transactionReq= [PushTransactionReq message];
//    transactionReq.transactionSigned = trans;
//
//    [client pushTransactionWithRequest:transactionReq handler:^(PushTransactionResp *response2, NSError *error2) {
//      NSLog(@"%@",response2);
//      NSLog(@"%@",response2.txHash);
////      NSString *converted = [response2.txHash base64EncodedStringWithOptions:0];
////      NSString *converted =[[NSString alloc] initWithData:response2.txHash encoding:NSUTF8StringEncoding];
//
//      // NSData hex to string
//      NSUInteger dataLength = [response2.txHash length];
//      NSMutableString *string = [NSMutableString stringWithCapacity:dataLength*2];
//      const unsigned char *dataBytes = (const unsigned char*)[response2.txHash bytes];
//      for (NSInteger idx = 0; idx < dataLength; ++idx) {
//        [string appendFormat:@"%02x", dataBytes[idx]];
//      }
//
//
//      NSLog(@"TXHASH : %@", string);
//      std::string message2 = std::string([string UTF8String]);
//      std::vector<unsigned char> teest = hstr2bin(message2);
//
//      // std::vector to NSData
//      NSMutableArray *signArray = [[NSMutableArray alloc] init];
//      for (int i=0; i < teest.size(); i++) {
//        [signArray addObject:[NSString stringWithFormat: @"%d", teest[i]] ];
//      }
//      NSLog(@"SIGNARRAY: %@", signArray);
//      NSData *signData = [NSKeyedArchiver archivedDataWithRootObject:signArray];
//      NSLog(@"SIGNDATA: %@", signData);
//      NSLog(@"Receiver Lattice registered!");
//
//
//      GetObjectReq *getobj = [GetObjectReq message];
//      getobj.query = signData;
//      NSLog(@"Getting tx information...");
//
//      [client getObjectWithRequest:getobj handler:^(GetObjectResp *response3, NSError *error) {
//        NSLog(@"REPONSE: %@", response3);
//        NSLog(@"REPONSE.TRANSACTION: %@", response3.transaction);
//        NSLog(@"REPONSE.TRANSACTION.TX: %@", response3.transaction.tx);
//      }];
//    }];
//  }];
//
//  // SENDER
//  //  NSLog(@"Registering Sender Lattice...");
//  //  [client getLatticePublicKeyTxnWithRequest:sender_transaction handler:^(TransferCoinsResp *response, NSError *error) {
//  //    if (!error){
//  //      NSLog(@"Sender Lattice registered!");
//  //    }
//  //  }];
//
//
//  //    ////////////////////
//  //    // 4 - Creating PushTransactionReq message
//  //    ////////////////////
//  //    PushTransactionReq *transactionReq= [PushTransactionReq message];
//  //    transactionReq.transactionSigned = trans;
//  //    [client pushTransactionWithRequest:transactionReq handler:^(PushTransactionResp *response2, NSError *error2) {
//  //      NSLog(@"\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n%@\n%@\n$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\n", response2, error2);
//  //
//  //      EphemeralChannelPayload *chanPayload = [EphemeralChannelPayload message];
//  //      chanPayload.prf512Seed = [@"Q68e456a20871d366331d7eefa4eaf8886831cd23a2d55f099d2870160313280480bc4057" dataUsingEncoding:NSUTF8StringEncoding];
//  //
//  //      chanPayload.dilithiumSignature =[@"Q68e456a20871d366331d7eefa4eaf8886831cd23a2d55f099d2870160313280480bc4057" dataUsingEncoding:NSUTF8StringEncoding]  ;
//  //      chanPayload.addrFrom = [@"Q68e456a20871d366331d7eefa4eaf8886831cd23a2d55f099d2870160313280480bc4057" dataUsingEncoding:NSUTF8StringEncoding]; // wallet address
//  //      chanPayload.data_p = [@"HELLO QRL" dataUsingEncoding:NSUTF8StringEncoding];
//  //
//  //      EncryptedEphemeralMessage_Channel *chan = [EncryptedEphemeralMessage_Channel message];
//  //      chan.encAes256Symkey = [@"Q68e456a20871d366331d7eefa4eaf8886831cd23a2d55f099d2870160313280480bc4057" dataUsingEncoding:NSUTF8StringEncoding];;
//  //
//  //      EncryptedEphemeralMessage *ephMess = [EncryptedEphemeralMessage message];
//  //      ephMess.msgId = [@"Q68e456a20871d366331d7eefa4eaf8886831cd23a2d55f099d2870160313280480bc4057" dataUsingEncoding:NSUTF8StringEncoding];
//  //      ephMess.ttl = 987234987234;
//  //      ephMess.ttr = 0;
//  //      ephMess.nonce = 0;
//  //      ephMess.channel = chan;
//  //      ephMess.payload = [@"Q68e456a20871d366331d7eefa4eaf8886831cd23a2d55f099d2870160313280480bc4057" dataUsingEncoding:NSUTF8StringEncoding] ;
//  //
//  //      PushEphemeralMessageReq *mess = [PushEphemeralMessageReq message];
//  //      mess.ephemeralMessage = ephMess;
//  //
//  //      // pushEphemeralMessage
//  //      [client pushEphemeralMessageWithRequest:mess handler:^(PushTransactionResp *response3, NSError *error3) {
//  //        NSLog(@"\n::::::::::::::::::::::::::::::::::\n%@\n%@\n::::::::::::::::::::::::::::::::::\n", response3, error3);
//  //      }];
//  //    }];
//
//}
//
//
//@end
//
//
//
//
