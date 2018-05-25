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

@implementation CreateWallet
RCT_EXPORT_MODULE();

// Create wallet function that returns the wallet address as a callback
//RCT_EXPORT_METHOD(createWallet:(NSString*)hashFunction (RCTResponseSenderBlock)callback )
RCT_EXPORT_METHOD(createWallet:(NSString*)treeHeight hashFunction:(NSString*)hashFunction callback:(RCTResponseSenderBlock)callback)
{

  NSLog(@"Creating wallet....");
  NSLog(@"TREE HEIGHT : %@", treeHeight);
  NSLog(@"HASH FUNCTION : %@", hashFunction);
  
  // fixed seed for testing purpose
  // would need to generate the seed on the RN side to avoid code duplication (iOS/Android)
  std::vector<unsigned char> seed(48, 0);
  
//  NSData *dataData = [NSData dataWithBytes:seed length:sizeof(seed)];
//  NSLog(@"data = %x", seed[0]);

  // convert NSString to int
  int treeHeightInt = [treeHeight intValue];
  
  // create wallet
  XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
  auto address = bin2hstr(xmss.getAddress());
  NSString *wallet_address = [NSString stringWithCString:address.c_str() encoding:[NSString defaultCStringEncoding]];
  NSLog(@"Wallet address %@", wallet_address);
  
  // send callback to RN
  callback(@[[NSNull null], wallet_address ]);
  
}

@end

