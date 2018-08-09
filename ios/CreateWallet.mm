//
//  CreateWallet.m
//  theQRL
//
//  Created by abilican on 17.05.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "CreateWallet.h"
#import <React/RCTLog.h>
#import <Foundation/Foundation.h>
#import "KyberIos.h"
#import "testingEphemeral.h"
#import <GRPCClient/GRPCCall+ChannelArg.h>
#import <GRPCClient/GRPCCall+Tests.h>
#import <theQRL/Qrl.pbrpc.h>
#import <kyber.h>
#import "dilithium.h"
#import "xmss.h"
#import "xmssBase.h"
#import "xmssFast.h"
#import "misc.h"
#include <xmssBasic.h>
#include <iostream>

@implementation CreateWallet
RCT_EXPORT_MODULE();

// Create wallet function that returns the wallet address as a callback
//RCT_EXPORT_METHOD(createWallet:(NSString*)hashFunction (RCTResponseSenderBlock)callback )
RCT_EXPORT_METHOD(createWallet:(NSString* )treeHeight hashFunction:(NSNumber* _Nonnull)hashFunction callback:(RCTResponseSenderBlock)callback)
{
  NSLog(@"Creating wallet....");
  NSLog(@"TREE HEIGHT : %@", treeHeight);
  NSLog(@"HASH FUNCTION : %@", hashFunction);
  
  // GRPC call test
  static NSString * const kHostAddress = @"testnet-2.automated.theqrl.org:19009";
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  [GRPCCall setUserAgentPrefix:@"HelloWorld/1.0" forHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  GetStatsReq *getStatsReq = [GetStatsReq message];
  NSLog(@"Getting tx information...");
  [client getStatsWithRequest:getStatsReq handler:^(GetStatsResp *response, NSError *error) {
    NSLog(@"RESPONSE __________________________GetStats__________________________: %@", response);
  }];
  
  GetNodeStateReq *getNodeState = [GetNodeStateReq message];
  NSLog(@"Getting tx information...");
  [client getNodeStateWithRequest:getNodeState handler:^(GetNodeStateResp *response, NSError *error) {
    NSLog(@"RESPONSE: __________________________GetNodeState__________________________: %@", response);
  }];
  
  
  NSString *command = @"010500b48fb25a343d59eb058e6726f5e8bf9c64ee4ccd26ea1299a1a88e1d64ac82d834d550e9";
  
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
  NSLog(@"%@", commandToSend);
  


  GetAddressStateReq *getAddressStateReq = [GetAddressStateReq message];
  NSData *walletAddress = [@"010500b48fb25a343d59eb058e6726f5e8bf9c64ee4ccd26ea1299a1a88e1d64ac82d834d550e9" dataUsingEncoding:NSUTF8StringEncoding];
  getAddressStateReq.address = commandToSend;
  [client getAddressStateWithRequest:getAddressStateReq handler:^(GetAddressStateResp *response2, NSError *error2) {
    NSLog(@"RESPONSE: __________________________GetAddressState__________________________: %@", response2);
    NSLog(@"ERROR: %@", error2);
  }];
  

  
  // empty array of unsigned char
  unsigned char seed_array[48];
  // filling the array with randombytes
  randombytes(seed_array, 48);
  // converting array to vector
  std::vector<unsigned char> seed(seed_array, seed_array + sizeof seed_array / sizeof seed_array[0]);
  
//  NSData *dataData = [NSData dataWithBytes:seed length:48];
//  NSLog(@"data = %x", dataData[0]);

//  std::cout << std::endl;
//  std::cout << "seed:" << seed.size() << " bytes\n" << bin2hstr(seed, 16) << std::endl;
//  std::cout << std::endl;
  
  int hashFunctionIndex = [hashFunction intValue];
  // create wallet according to the hash function
  
  callback(@[[NSNull null], @"address"]);
  int treeHeightInt = [treeHeight intValue];
  
//  XmssBasic xmss;
  
//  XmssBasic xmss(seed, 8, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
  
  
  
  
  

  
  // instead of switch
  callback(@[[NSNull null], @"BLABLAAAA" ]);

  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
}

@end

