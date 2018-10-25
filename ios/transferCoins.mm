//
//  transferCoins.m
//  theQRL
//
//  Created by abilican on 10.08.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "transferCoins.h"
#import <React/RCTLog.h>
#import <Foundation/Foundation.h>
#import <GRPCClient/GRPCCall+ChannelArg.h>
#import <GRPCClient/GRPCCall+Tests.h>
#import <theQRL/Qrl.pbrpc.h>
#import "xmss.h"
#import "xmssBase.h"
#import "xmssFast.h"
//#include "xmssPool.h"
#import "misc.h"
#import <CommonCrypto/CommonDigest.h>
#include <xmssBasic.h>
#include <iostream>
#include <shasha.h>
#include "hashing.h"
#import "WalletHelperFunctions.h"

@implementation transferCoins

RCT_EXPORT_MODULE();
// Refresh the wallet balance and last transactions list
RCT_EXPORT_METHOD(sendCoins:(NSString* )recipient withAmount:(NSNumber* _Nonnull) amount withOts:(NSNumber* _Nonnull ) otsIndex withFee: (NSNumber* _Nonnull) fee callback:(RCTResponseSenderBlock)callback)
{
 
  
  int otsIndexInt = [otsIndex intValue];
  UInt64 feeInt = [fee longLongValue];
  
  
  //Int64 amountInt = [amount int64Value];
  UInt64 amountInt = [amount longLongValue];
  
  NSLog(@"AMOUNT TO SEND IS %llu", (uint64_t) amountInt);
  NSLog(@"FEE TO SEND IS %llu", (uint64_t) feeInt);
  
  // converting nsstring fee to nsnumber to int
//  NSNumberFormatter *f = [[NSNumberFormatter alloc] init];
//  f.numberStyle = NSNumberFormatterDecimalStyle;
//  NSNumber *fee_nb = [f numberFromString:fee];
//  int feeInt = [fee_nb intValue];
  
  std::vector<uint8_t> hexSeed= {};
  // Opening XMSS object with hexseed
  NSString* hexseed = [WalletHelperFunctions getFromKeychain:@"hexseed"];
//  NSString* walletAddress = [WalletHelperFunctions getFromKeychain:@"address"];
//  NSString* hexseed = @"01050025f6c0b547c4231721f71c90176b6ee20b2aeff81f81773e099f2d9625e8045cba8aa504bdade1b6e5e3e05d9264e8d3";
  NSLog(@"HEXSEED TO USE : %@", hexseed);
  
  for (int i=6; i < [hexseed length]; i+=2) {
    NSString* subs = [hexseed substringWithRange:NSMakeRange(i, 2)];
    // converting hex to corresponding decimal
    unsigned result = 0;
    NSScanner* scanner = [NSScanner scannerWithString:subs];
    [scanner scanHexInt:&result];
    // adding to hex
    hexSeed.push_back(result);
  }
  
  
  // gRPC initialization
//  static NSString * const kHostAddress = @"testnet-2.automated.theqrl.org:19009";
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  // Converting xmssPK to NSData
  
//  NSMutableArray *sender_xmssPkArray = [[NSMutableArray alloc] init];
//  for (int i=0; i < xmss_obj.getPK().size(); i++) {
//    [sender_xmssPkArray addObject:@(xmss_obj.getPK()[i]) ];
//  }
//  NSData *sender_xmssPkData = [NSKeyedArchiver archivedDataWithRootObject:sender_xmssPkArray];
  
  
  NSString* xmsspk = [WalletHelperFunctions getFromKeychain:@"xmsspk"];
  NSLog(@"XMSS PK %@", xmsspk);
  
//  NSString* xmsspk = @"0105007e41c011a706c8edd8d1a2f18d558d14311917cd549b3edae07775b12d6640ef35ea0d4dd47fc36e2bc6d5aa5f6ef7582fcf6b8a564ea0ff3af3b42af05cbac9";
//  auto pk = bin2hstr(xmss_obj.getPK(),16);
//  NSString *wallet_pk = [NSString stringWithCString:pk.c_str() encoding:[NSString defaultCStringEncoding]];
  
  NSMutableData *xmssPk = [WalletHelperFunctions nsStringHex2nsData:xmsspk];
//  NSMutableData *commandToSend = [WalletHelperFunctions nsStringHex2nsData:walletAddress];
  NSMutableData *recipientAddress = [WalletHelperFunctions nsStringHex2nsData:[recipient substringFromIndex:1]];
  
  // array for recipient addresse(s)
  NSMutableArray *addressToArray = [[NSMutableArray alloc] init];
  [addressToArray addObject:recipientAddress];
  
  // array for amount(s) to send
  GPBUInt64Array *amountsArray = [[GPBUInt64Array alloc] init];
  
  
//  NSNumberFormatter *f2 = [[NSNumberFormatter alloc] init];
//  f2.numberStyle = NSNumberFormatterDecimalStyle;
//  NSLog(@"AMOUNT IS %@", amount);
//  NSNumber *amount_nb = [f2 numberFromString:amount];
//  int amount_int = [amount_nb intValue];
  
//  int shor_int = [shor intValue];

  [amountsArray addValue:(uint64_t) amountInt];
  
  // GRPC call transferCoins
  TransferCoinsReq *transferCoinsReq = [TransferCoinsReq message];
//  transferCoinsReq.masterAddr = commandToSend;
  transferCoinsReq.addressesToArray = addressToArray;
  transferCoinsReq.amountsArray = amountsArray;
  transferCoinsReq.fee = feeInt;
  transferCoinsReq.xmssPk = xmssPk;
 
  
  [client transferCoinsWithRequest:transferCoinsReq handler:^(TransferCoinsResp *response, NSError *error) {
    
    NSLog(@" RESPONSE %@", response);
    NSLog(@" ERROR %@", error);
//    NSLog(@" TX FEE %llu", response.extendedTransactionUnsigned.tx.fee);
    
//    NSMutableData *concatenatedArrays = [[NSMutableData alloc] init];
    
    // We need to create a Uint8 array containing the fee + addr_to + amount
    std::vector<unsigned char> concatenatedVector = {};
  
    // 1 - get the fee as byte array
    NSMutableData* myData = [[NSMutableData alloc] init];
    // Converts a 64-bit integer from the host’s native byte order to big-endian format.
    // https://developer.apple.com/documentation/corefoundation/1425303-cfswapint64hosttobig
    UInt64 fees = CFSwapInt64HostToBig(response.extendedTransactionUnsigned.tx.fee);
    [myData appendBytes:&fees length:sizeof(fees)];
    NSUInteger len = [myData length];
    Byte *byteData = (Byte*)malloc(len);
    memcpy(byteData, [myData bytes], len);

    for (int p=0; p<sizeof(byteData); p++){
      unsigned char byteData1 = byteData[p];
      concatenatedVector.push_back(byteData1);
//      [concatenatedArrays appendBytes:&byteData1 length:len];
    }
    
    // 2 - get the addr_to as byte array
    // Convert hex (2chars) to decimal
    NSString* recipientStr = [recipient substringFromIndex:1];
    std::vector<uint8_t> recipientSeed= {};
    for (int d=0; d < [recipientStr length]; d+=2) {
      NSString* subs = [recipientStr substringWithRange:NSMakeRange(d, 2)];
      // converting hex to corresponding decimal
      unsigned result = 0;
      NSScanner* scanner2 = [NSScanner scannerWithString:subs];
      [scanner2 scanHexInt:&result];
      // adding to hex
      concatenatedVector.push_back(result);
    }
    
    // 3 - get the amount as byte array
    NSMutableData* myDataAmounts = [[NSMutableData alloc] init];
    // Converts a 64-bit integer from the host’s native byte order to big-endian format.
    UInt64 amounts = CFSwapInt64HostToBig([response.extendedTransactionUnsigned.tx.transfer.amountsArray valueAtIndex:0]);
    [myDataAmounts appendBytes:&amounts length:sizeof(amounts)];
    NSUInteger len3 = [myDataAmounts length];
    Byte *byteData3 = (Byte*)malloc(len3);
    memcpy(byteData3, [myDataAmounts bytes], len3);
    for (int s=0; s<sizeof(byteData3); s++){
      unsigned char byData3 = byteData3[s];
      concatenatedVector.push_back(byData3);
    }
    
    for (int i = 0; i < concatenatedVector.size(); i++){
      NSLog(@" concatenatedVector %hhu", concatenatedVector[i] );
    }
    
    // Generate the SHA sum of concatenated array
    auto shaSum = sha2_256(concatenatedVector);
    std::string hashSumStr = bin2hstr(shaSum);
    NSString *hashSumNSString = [NSString stringWithCString:hashSumStr.c_str() encoding:[NSString defaultCStringEncoding]];
    NSLog(@" SHASUM %@", hashSumNSString );
    
    // Sign the SHA sum
    NSLog(@"%@", @"Opening Wallet....");
    
    
    NSNumberFormatter *f = [[NSNumberFormatter alloc] init];
    f.numberStyle = NSNumberFormatterDecimalStyle;
    NSNumber *myNumber = [f numberFromString: [WalletHelperFunctions getFromKeychain:@"treeheight"]];
    int tree_height = [myNumber intValue];
    
    XmssFast xmss_obj(hexSeed, tree_height);
    NSLog(@"%@", @"Wallet succesfully opened!");
    xmss_obj.setIndex(otsIndexInt);
    auto signature = xmss_obj.sign(shaSum);
  
    // signature to string
//    NSString *sigString = [WalletHelperFunctions nsDataHex2string:[NSData dataWithBytes:signature.data() length:signature.size()]] ;
    
    // Calculate tx hash
    std::vector<unsigned char> concatenatedVectorTx = {};
    // append shaSum
    for(int i=0; i< shaSum.size(); i++){
      concatenatedVectorTx.push_back( (uint8_t) shaSum[i]);
    }
    // append signature
    for(int i=0; i< signature.size(); i++){
      concatenatedVectorTx.push_back( (uint8_t) signature[i]);
    }
    // append PK
    for(int i=0; i< xmss_obj.getPK().size() ; i++){
      concatenatedVectorTx.push_back( (uint8_t) xmss_obj.getPK()[i] );
    }
    
    auto shaSumTx = sha2_256(concatenatedVectorTx);
    std::string hashSumTxStr = bin2hstr(shaSumTx);
    NSString *hashSumTxNSString = [NSString stringWithCString:hashSumTxStr.c_str() encoding:[NSString defaultCStringEncoding]];
    NSLog(@" HASHSHUM TXHASH %@", hashSumTxNSString );
    NSLog(@" SHASUMTX %@", [NSData dataWithBytes:shaSumTx.data() length:shaSumTx.size()] );

    // Prepare Transaction object to send
    Transaction *signedTx = response.extendedTransactionUnsigned.tx;
    signedTx.signature = [NSData dataWithBytes:signature.data() length:signature.size()];
    signedTx.transactionHash = [NSData dataWithBytes:shaSumTx.data() length:shaSumTx.size()];
    signedTx.fee = response.extendedTransactionUnsigned.tx.fee;
    signedTx.nonce = (UInt64) 12;
//    signedTx.publicKey = response.extendedTransactionUnsigned.tx.publicKey;
    signedTx.transfer.addrsToArray = response.extendedTransactionUnsigned.tx.transfer.addrsToArray;
    signedTx.transfer.amountsArray = response.extendedTransactionUnsigned.tx.transfer.amountsArray;
    
    PushTransactionReq *pushTransactionReq = [PushTransactionReq message];
    pushTransactionReq.transactionSigned = signedTx;
    
    [client pushTransactionWithRequest:pushTransactionReq handler:^(PushTransactionResp *response2, NSError *error2) {
      NSLog(@"PUSHTRANSACTION ERROR : %@", error2);
      NSLog(@"PUSHTRANSACTION RESPONSE : %@", response2);
      NSString *txHash = [WalletHelperFunctions nsDataHex2string:response2.txHash];
      NSLog(@" PUSHED TRANSACTION HASH IS : %@", txHash);
      if (error2){
        callback(@[[NSNull null], @"error" ]);
      }
      else {
        callback(@[[NSNull null], @"success" ]);
      }
    }];
  }];

}
@end
