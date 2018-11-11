//
//  CreateWallet.m
//  theQRL
//
//  Created by abilican on 17.05.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "refreshWallet.h"
#import <React/RCTLog.h>
#import <Foundation/Foundation.h>
#import <GRPCClient/GRPCCall+ChannelArg.h>
#import <GRPCClient/GRPCCall+Tests.h>
#import <theQRL/Qrl.pbrpc.h>
#import "misc.h"
#include <iostream>
#import "xmssFast.h"
#import "WalletHelperFunctions.h"

@implementation refreshWallet


RCT_EXPORT_MODULE();
// Refresh the wallet balance and last transactions list
RCT_EXPORT_METHOD(refreshWallet: (RCTResponseSenderBlock)callback)
{
  
//  static NSString * const kHostAddress = @"testnet-2.automated.theqrl.org:19009";
//  extern NSString *kHostAddress;
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  NSString* walletAddress = [WalletHelperFunctions getFromKeychain:@"address"];
  
  NSLog(@"WALLET ADDRESS FROM KEYCHAIN IS %@", walletAddress);
  
  // Initialization of variables
  __block int completed = 0;
  NSMutableArray *txResponseArray = [[NSMutableArray alloc] init];
  
  NSMutableData *commandToSend = [WalletHelperFunctions nsStringHex2nsData:walletAddress];
  
  // GRPC call getAddressState
  GetAddressStateReq *getAddressStateReq = [GetAddressStateReq message];
  getAddressStateReq.address = commandToSend;
  
  [client getAddressStateWithRequest:getAddressStateReq handler:^(GetAddressStateResp *response2, NSError *error2) {
    // Get latest 10 transactions of the wallet
    
    //NSLog(@"GetAddressState:\n%@", response2);
    
    NSUInteger tx_count_nsuint = response2.state.transactionHashesArray_Count;
    int tx_count = (int) tx_count_nsuint;
    
    int j;
    int tx_end;
    int tx_total;
    // in tx list the index 0 is the oldest tx -> we need a reverse for loop to get the latest 10 tx
    if (tx_count < 10) {
      tx_end = -1;
      tx_total = tx_count;
    }
    else {
      tx_end = tx_count - 11;
      tx_total = 10;
    }
    
    NSLog(@"ENTERED REFRESHWALLET" );
    NSLog(@"TX_COUNT %d", tx_count );
    NSLog(@"TX_END %d", tx_end );
    
    
    if (tx_count == 0){
      callback(@[[NSNull null], walletAddress, @(0), @(response2.state.balance), @"{}" ]);
    }
    
    else {
      for (j=tx_count - 1; j > tx_end ; j--) {
        NSLog(@"ENTERED FOR LOOP" );
        // GRPC call getObject
        GetObjectReq *getObjectRect = [GetObjectReq message];
        getObjectRect.query = response2.state.transactionHashesArray[j];
        [client getObjectWithRequest:getObjectRect handler:^(GetObjectResp *response, NSError *error) {
          // Check the type of the tx [from 7 to 13]
          NSString *stringFromDate = [WalletHelperFunctions formatDate:(NSTimeInterval)response.transaction.header.timestampSeconds];
          NSString *txHash = [WalletHelperFunctions nsDataHex2string:response.transaction.tx.transactionHash];
          
          // 7 = Transfer
          if (response.transaction.tx.transactionTypeOneOfCase == 7){
            NSString * toAddr = [WalletHelperFunctions nsDataHex2string:response.transaction.tx.transfer.addrsToArray[0]];
            NSString *title = [[NSString alloc] init];
            // check if sent or received
            if ( [toAddr isEqual:walletAddress] ){
              title = @"RECEIVED";
            }
            else {
              title = @"SENT";
            }
            
            //          NSString *desc;
            //          // format the amount according to shor qty
            //          uint64_t amountUint = [response.transaction.tx.transfer.amountsArray valueAtIndex:0];
            //          if (amountUint % 1000000000 == 0){
            //            NSString *amountStr = [NSString stringWithFormat:@"%llu", [response.transaction.tx.transfer.amountsArray valueAtIndex:0]/1000000000] ;
            //            desc = [amountStr stringByAppendingString:@" QUANTA"];
            //          }
            //          else {
            //            float amountFloat = [response.transaction.tx.transfer.amountsArray valueAtIndex:0] / 1000000000;
            //            NSString *amountStr = [NSString stringWithFormat:@"%f", amountFloat] ;
            //            desc = [amountStr stringByAppendingString:@" QUANTA"];
            //          }
            
            
            NSString *amountStr = [NSString stringWithFormat:@"%llu", [response.transaction.tx.transfer.amountsArray valueAtIndex:0]] ;
            
            // add amount and recipient to NSDictionary
            NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                              title, @"title",
                                              amountStr, @"desc",
                                              stringFromDate, @"date",
                                              txHash, @"txhash",
                                              nil];
            [txResponseArray addObject:txJsonDictionary];
            // increment to mark the end of the for loop
            completed++;
          }
          
          // 10 = message
          if (response.transaction.tx.transactionTypeOneOfCase == 10){
            // NSLog(@"TOKEN ....%@ ", response.transaction.tx.token.symbol);
            // add amount and recipient to NSDictionary
            NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                              @"MESSAGE", @"title",
                                              @"View message", @"desc",
                                              stringFromDate, @"date",
                                              txHash, @"txhash",
                                              nil];
            [txResponseArray addObject:txJsonDictionary];
            // increment to mark the end of the for loop
            completed++;
          }
          
          // 11 = Token
          if (response.transaction.tx.transactionTypeOneOfCase == 11){
            NSString * nsDataSymbolHex = [WalletHelperFunctions  nsDataHex2string:response.transaction.tx.token.symbol ];
            NSString *tokenSymbol = [WalletHelperFunctions nsStringHex2ascii:nsDataSymbolHex ];
            // add amount and recipient to NSDictionary
            NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                              @"TOKEN CREATION", @"title",
                                              tokenSymbol, @"desc",
                                              stringFromDate, @"date",
                                              txHash, @"txhash",
                                              nil];
            [txResponseArray addObject:txJsonDictionary];
            // increment to mark the end of the for loop
            completed++;
          }
          
          // 12 = Token Transfer
          if (response.transaction.tx.transactionTypeOneOfCase == 12){
            //          NSLog(@"Transfer TOKEN:\n%@", response.transaction);
            // add amount and recipient to NSDictionary
            NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                              @"SENT", @"title",
                                              @"", @"desc",
                                              stringFromDate, @"date",
                                              txHash, @"txhash",
                                              nil];
            [txResponseArray addObject:txJsonDictionary];
            // increment to mark the end of the for loop
            completed++;
          }
          
          
          int otsIndex = 0;
          // return the callback only when the list of latest 10 tx is ready
          if (completed == tx_total){
            // send the next available ots index
            for (int i=0; i<response2.state.otsBitfieldArray_Count; i++){
              // i is the position of the byte
              NSData *data = response2.state.otsBitfieldArray[i];
              NSString * converted = [data description];
              // NSLog(@"OTS_BITFILED STRING -- : %@", converted );
              NSString *binaryStr = [WalletHelperFunctions hexToBinary:converted];
              BOOL otsFound = false;
              
              for (int j=7; j>-1; j--){
                NSLog(@"J : %d", j );
                NSString *otsValue = [binaryStr substringWithRange:NSMakeRange(j, 1)];
                if ([otsValue isEqual: @"0"]){
                  otsFound = true;
                  // otsIndex returns 0..7, we have to take into account the byte position in the array as well
                  otsIndex = (8 * i) + 7 - j;
                  break;
                }
                NSLog(@"OTS_BITFILED STRING : %@", otsValue );
              }
              if (otsFound){
                break;
              }
            }
            
            NSData *txJsonData = [NSJSONSerialization dataWithJSONObject:txResponseArray options:NSJSONWritingPrettyPrinted error:&error];
            NSString *txJsonString = [[NSString alloc] initWithData:txJsonData encoding:NSUTF8StringEncoding];
            NSLog(@"jsonData as string:\n%@", txJsonString);
            callback(@[[NSNull null], walletAddress, @(otsIndex), @(response2.state.balance), txJsonString ]);
          }
        }];
      }
    }
  }];

}


// Return the mnemonic and hexseed for the wallet
RCT_EXPORT_METHOD(sendWalletPrivateInfo: (RCTResponseSenderBlock)callback)
{
  std::vector<uint8_t> hexSeed= {};
  NSString* hexseed = [WalletHelperFunctions getFromKeychain:@"hexseed"];
  
  int i;
  for (i=6; i < [hexseed length]; i+=2) {
    NSString* subs = [hexseed substringWithRange:NSMakeRange(i, 2)];
    // converting hex to corresponding decimal
    unsigned result = 0;
    NSScanner* scanner = [NSScanner scannerWithString:subs];
    [scanner scanHexInt:&result];
    // adding to hex
    hexSeed.push_back(result);
  }
  // opening wallet and sending mnemonic and hexSeed to user
  XmssFast xmss_obj(hexSeed, 10);
  NSString* mnemonic = [NSString stringWithUTF8String:bin2mnemonic(xmss_obj.getExtendedSeed()).c_str()];
  NSString* hexSeedStr = [NSString stringWithUTF8String:bin2hstr(xmss_obj.getExtendedSeed() ).c_str()];
  callback(@[[NSNull null], mnemonic, hexSeedStr ]);
}



// Check if the wallet has a pending tx
RCT_EXPORT_METHOD(checkPendingTx: (RCTResponseSenderBlock)callback)
{
  NSLog(@"CHECKING IF UNCONFIRMED TX OBJC");
  NSString* wallet_address = [WalletHelperFunctions getFromKeychain:@"address"];
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  GetLatestDataReq *getLatestDataReq = [GetLatestDataReq message];
  getLatestDataReq.filter = GetLatestDataReq_Filter_TransactionsUnconfirmed;
  
  [client getLatestDataWithRequest:getLatestDataReq handler:^(GetLatestDataResp *response, NSError *error) {
    if ( (unsigned long)response.transactionsUnconfirmedArray_Count == 0 ){
      NSLog(@"NO UNCONFIRMED TX");
      callback(@[[NSNull null], @"success" ]);
    }
    else {
      NSLog(@"UNCONFIRMED TX FOUND");
      NSLog(@"ADDRESS %@", response.transactionsUnconfirmedArray[0].addrFrom);
    
      // loop thrgough unconfirmed tx
      int found = 0;
      for (int i=0; i<response.transactionsUnconfirmedArray_Count; i++){
        NSString *tx_address = [WalletHelperFunctions  nsDataHex2string:response.transactionsUnconfirmedArray[i].addrFrom];
        if ([tx_address isEqualToString:wallet_address]){
          callback(@[[NSNull null], @"error" ]);
          found++;
          break;
        }
      }
      if (found == 0){
        callback(@[[NSNull null], @"success" ]);
      }
    }
  }];
}


// get tx details
RCT_EXPORT_METHOD(getTxDetails:(NSString* )txhash callback:(RCTResponseSenderBlock)callback)
{
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  GetObjectReq *getObjectReq = [GetObjectReq message];
  getObjectReq.query = [WalletHelperFunctions nsStringHex2nsData:txhash];
  
  [client getObjectWithRequest:getObjectReq handler:^(GetObjectResp *response, NSError *error) {
    NSLog(@"%@", response);
    
    NSDictionary *txInfoJson = [NSDictionary dictionaryWithObjectsAndKeys:
                                      @(response.transaction.header.blockNumber), @"blocknumber",
                                      @(response.transaction.tx.nonce), @"nonce",
                                      [WalletHelperFunctions nsDataHex2string:response.transaction.addrFrom], @"from",
                                      [WalletHelperFunctions nsDataHex2string:response.transaction.tx.transfer.addrsToArray[0]], @"to",
                                      @([response.transaction.tx.transfer.amountsArray valueAtIndex:0]), @"amount",
                                      nil];
    NSData *txJsonData = [NSJSONSerialization dataWithJSONObject:txInfoJson options:NSJSONWritingPrettyPrinted error:&error];
    NSString *txInfoJsonStr = [[NSString alloc] initWithData:txJsonData encoding:NSUTF8StringEncoding];
    callback(@[[NSNull null], txInfoJsonStr ]);
  }];
}


@end


