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

@implementation IosWallet


// Converting NSData hexstring (<a4a67b43 9c94efd9...>) bytes into NSString hexstring (a4a67b439c94efd9...)
+ (NSString *) nsDataHex2string:(NSData *)nsDataHex {
  
  NSData *data = nsDataHex;
  NSUInteger capacity = data.length * 2;
  NSMutableString *sbuf = [NSMutableString stringWithCapacity:capacity];
  const unsigned char *buf = (const unsigned char*) [data bytes];
  NSInteger t;
  for (t=0; t<data.length; ++t) {
    [sbuf appendFormat:@"%02lx", (unsigned long)buf[t]];
  }
  NSString *hexString = sbuf;
  return hexString;
}

//Converting NSString hexstring (a4a67b439c94efd9...) to NSData hexstring (<a4a67b43 9c94efd9...>) bytes
+ (NSMutableData *) nsStringHex2nsData:(NSString *)nsStringHex {
  NSString *command = nsStringHex;
  command = [command stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSMutableData *commandToSend= [[NSMutableData alloc] init];
  unsigned char whole_byte;
  char byte_chars[3] = {'\0','\0','\0'};
  int i;
  for (i=0; i < [command length]/2; i++) {
    byte_chars[0] = [command characterAtIndex:i*2];
    byte_chars[1] = [command characterAtIndex:i*2+1];
    whole_byte = strtol(byte_chars, NULL, 16);
    [commandToSend appendBytes:&whole_byte length:1];
  }
  return commandToSend;
}


//Converting NSString hexstring (a4a67b439c94efd9...) to corresponding ASCII characters
+ (NSMutableString *) nsStringHex2ascii:(NSString *)nsStringHex {
  NSString * str = nsStringHex;
  NSMutableString * newString = [[NSMutableString alloc] init];
  int i = 0;
  while (i < [str length])
  {
    NSString * hexChar = [str substringWithRange: NSMakeRange(i, 2)];
    int value = 0;
    sscanf([hexChar cStringUsingEncoding:NSASCIIStringEncoding], "%x", &value);
    [newString appendFormat:@"%c", (char)value];
    i+=2;
  }
  return newString;
}

// Format a timestamp to the correct Date format and returns as a NSString
+ (NSString *) formatDate:(NSTimeInterval)timestamp {
  NSTimeInterval unixTimeStamp = timestamp;
  NSDate *date = [NSDate dateWithTimeIntervalSince1970: unixTimeStamp];
  NSDateFormatter *formatter = [[NSDateFormatter alloc] init];
  [formatter setDateFormat:@"h:mm a, MMM d yyyy"];
  NSString *stringFromDate = [formatter stringFromDate:date];
  return stringFromDate;
}




RCT_EXPORT_MODULE();
// Refresh the wallet balance and last transactions list
RCT_EXPORT_METHOD(refreshWallet:(NSString* )walletAddress callback:(RCTResponseSenderBlock)callback)
{
  static NSString * const kHostAddress = @"testnet-2.automated.theqrl.org:19009";
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  // Initialization of variables
  __block int completed = 0;
  NSMutableArray *txResponseArray = [[NSMutableArray alloc] init];
  
  NSMutableData *commandToSend = [[self class] nsStringHex2nsData:walletAddress];
  
  // GRPC call getAddressState
  GetAddressStateReq *getAddressStateReq = [GetAddressStateReq message];
  getAddressStateReq.address = commandToSend;
  
  [client getAddressStateWithRequest:getAddressStateReq handler:^(GetAddressStateResp *response2, NSError *error2) {
    // Get latest 10 transactions of the wallet
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
    
    for (j=tx_count - 1 ; j > tx_end ; j--) {
      // GRPC call getObject
      GetObjectReq *getObjectRect = [GetObjectReq message];
      getObjectRect.query = response2.state.transactionHashesArray[j];
      [client getObjectWithRequest:getObjectRect handler:^(GetObjectResp *response, NSError *error) {
        // Check the type of the tx [from 7 to 13]
        NSString *stringFromDate = [[self class] formatDate:(NSTimeInterval)response.transaction.header.timestampSeconds];
        
        
        // 7 = Transfer
        if (response.transaction.tx.transactionTypeOneOfCase == 7){
          NSString * toAddr = [[self class] nsDataHex2string:response.transaction.tx.transfer.addrsToArray[0]];
          NSString *title = [[NSString alloc] init];
          // check if sent or received
          if ( [toAddr isEqual:walletAddress] ){
            title = @"RECEIVED";
          }
          else {
            title = @"SENT";
          }
          NSString *amountStr = [NSString stringWithFormat:@"%llu", [response.transaction.tx.transfer.amountsArray valueAtIndex:0]/100000000] ;
          NSString *desc = [amountStr stringByAppendingString:@" QUANTA"];
          // add amount and recipient to NSDictionary
          NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                                title, @"title",
                                                desc, @"desc",
                                                stringFromDate, @"date",
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
                                            nil];
          [txResponseArray addObject:txJsonDictionary];
          // increment to mark the end of the for loop
          completed++;
        }
        
        // 11 = Token
        if (response.transaction.tx.transactionTypeOneOfCase == 11){
          NSString * nsDataSymbolHex = [[self class]  nsDataHex2string:response.transaction.tx.token.symbol ];
          NSString *tokenSymbol = [[self class]  nsStringHex2ascii:nsDataSymbolHex ];
          // add amount and recipient to NSDictionary
          NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                            @"TOKEN CREATION", @"title",
                                            tokenSymbol, @"desc",
                                            stringFromDate, @"date",
                                            nil];
          [txResponseArray addObject:txJsonDictionary];
          // increment to mark the end of the for loop
          completed++;
        }
        
        // 12 = Token Transfer
        if (response.transaction.tx.transactionTypeOneOfCase == 12){
          NSLog(@"Transfer TOKEN:\n%@", response.transaction);
          // add amount and recipient to NSDictionary
          NSDictionary *txJsonDictionary = [NSDictionary dictionaryWithObjectsAndKeys:
                                            @"SENT", @"title",
                                            @"", @"desc",
                                            stringFromDate, @"date",
                                            nil];
          [txResponseArray addObject:txJsonDictionary];
          // increment to mark the end of the for loop
          completed++;
        }
        
        // return the callback only when the list of latest 10 tx is ready
        if (completed == tx_total){
          NSData *txJsonData = [NSJSONSerialization dataWithJSONObject:txResponseArray options:NSJSONWritingPrettyPrinted error:&error];
          NSString *txJsonString = [[NSString alloc] initWithData:txJsonData encoding:NSUTF8StringEncoding];
          NSLog(@"jsonData as string:\n%@", txJsonString);
          callback(@[[NSNull null], @(response2.state.balance), txJsonString ]);
        }
      }];
    }
  }];

}

@end


