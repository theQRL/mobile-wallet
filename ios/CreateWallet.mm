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
#import "xmssBasic.h"
#import "xmssFast.h"
#import "misc.h"
#include <xmssBasic.h>
#include <iostream>
#import "WalletHelperFunctions.h"

@implementation CreateWallet
RCT_EXPORT_MODULE();

// Create wallet function that returns the wallet address as a callback
//RCT_EXPORT_METHOD(createWallet:(NSString*)hashFunction (RCTResponseSenderBlock)callback )
RCT_EXPORT_METHOD(createWallet:(NSNumber* _Nonnull)treeHeight hashFunction:(NSNumber* _Nonnull)hashFunction callback:(RCTResponseSenderBlock)callback)
{
  // Remove all previous data from the keychain
  NSDictionary *spec = @{(__bridge id)kSecClass:(__bridge id)kSecClassGenericPassword};
  SecItemDelete((__bridge CFDictionaryRef)spec);
  
  // empty array of unsigned char
  unsigned char seed_array[48];
  // filling the array with randombytes
  randombytes(seed_array, 48);
  // converting array to vector
  std::vector<unsigned char> seed(seed_array, seed_array + sizeof seed_array / sizeof seed_array[0]);

  // create wallet according to the hash function
  int treeHeightInt = [treeHeight intValue];
  int hashFunctionIndex = [hashFunction intValue];
  
  eHashFunction walletHashFunction;
  
  switch(hashFunctionIndex) {
    case 1: {
      walletHashFunction = eHashFunction::SHAKE_128;
      break; //optional
    }
    case 2: {
      walletHashFunction = eHashFunction::SHAKE_256;
      break; //optional
    }
    case 3: {
      walletHashFunction = eHashFunction::SHA2_256;
      break;
    }
    default: {
      walletHashFunction = eHashFunction::SHAKE_128;
      break;
    }
  }
  
  // creating new wallet
  XmssFast xmss = XmssFast(seed, treeHeightInt, walletHashFunction, eAddrFormatType::SHA256_2X);
  std::string hexSeed = bin2hstr(xmss.getExtendedSeed());
  
  // saving the hexSeed to the keychain
  NSString *hexSeedNSString = [NSString stringWithCString:hexSeed.c_str() encoding:[NSString defaultCStringEncoding]];
  OSStatus sts = [WalletHelperFunctions saveToKeychain:@"hexseed" withValue:hexSeedNSString];
  
  // remove hexseed from keychain (for debugging only)
//  OSStatus sts = SecItemDelete((__bridge CFDictionaryRef)keychainItem);
  
  // send callback to RN
  if( (int)sts == 0 ){
    // saving wallet address to the keychain
    NSString *wallet_address = [NSString stringWithCString:bin2hstr(xmss.getAddress()).c_str() encoding:[NSString defaultCStringEncoding]];
    OSStatus sts2 = [WalletHelperFunctions saveToKeychain:@"address" withValue:wallet_address];
    if( (int)sts2 == 0 ){
      // wallet successfuly created ans hexseed saved to the keychain
      NSString *xmss_pk = [NSString stringWithCString:bin2hstr(xmss.getPK()).c_str() encoding:[NSString defaultCStringEncoding]];
      //save wallet address to the keychain
      OSStatus sts3 = [WalletHelperFunctions saveToKeychain:@"xmsspk" withValue:xmss_pk];
      if( (int)sts3 == 0 ){
        NSNumber *tree_height_nb = [NSNumber numberWithInt:xmss.getHeight()];
        NSString *tree_height = [tree_height_nb stringValue];
        //save wallet address to the keychain
        OSStatus sts4 = [WalletHelperFunctions saveToKeychain:@"treeheight" withValue:tree_height];
        if( (int)sts4 == 0 ){
          callback(@[[NSNull null], @"success" ]);
        }
        else {
          NSLog(@"ERROR saving treeheight to keychain: %d",(int)sts4);
          callback(@[[NSNull null], @"error" ]);
        }
        
        
//        callback(@[[NSNull null], @"success" ]);
      }
      else {
        callback(@[[NSNull null], @"error" ]);
      }
    }
    else {
      NSLog(@"Error Code: %d", (int)sts);
      callback(@[[NSNull null], @"error" ]);
    }
  }
  else{
    NSLog(@"Error Code: %d", (int)sts);
    callback(@[[NSNull null], @"error" ]);
  }
}





// save the user's entered hexseed to keychain
RCT_EXPORT_METHOD(openWalletWithHexseed:(NSString* )hexseed callback:(RCTResponseSenderBlock)callback){
  
  // Remove all previous data from the keychain
  NSDictionary *spec = @{(__bridge id)kSecClass:(__bridge id)kSecClassGenericPassword};
  SecItemDelete((__bridge CFDictionaryRef)spec);

  NSLog(@"OPENING WALLET FROM HEXSEED");
  NSLog(@"HEXSEED IS %@", hexseed);
    
  // convert hexseed NSString to a vector of uint8_t
  std::vector<uint8_t> hexSeed= {};
  // Opening XMSS object with hexseed
  for (int i=0; i < [hexseed length]; i+=2) {
    NSString* subs = [hexseed substringWithRange:NSMakeRange(i, 2)];
    // converting hex to corresponding decimal
    unsigned result = 0;
    NSScanner* scanner = [NSScanner scannerWithString:subs];
    [scanner scanHexInt:&result];
    // adding to hex
    hexSeed.push_back(result);
  }
  // try to open the wallet
  
  try{
    
    QRLDescriptor desc = QRLDescriptor::fromExtendedSeed(hexSeed);
    OSStatus sts = [WalletHelperFunctions saveToKeychain:@"hexseed" withValue:hexseed];
    
    // send callback to RN
    if( (int)sts == 0 ){
      // hexseed successfuly saved to the keychain
      hexSeed.erase(hexSeed.begin(), hexSeed.begin() + 3);
      XmssFast xmss = XmssFast( hexSeed, desc.getHeight(), desc.getHashFunction(), eAddrFormatType::SHA256_2X);
      NSString *wallet_address = [NSString stringWithCString:bin2hstr(xmss.getAddress()).c_str() encoding:[NSString defaultCStringEncoding]];
      //save wallet address to the keychain
      OSStatus sts2 = [WalletHelperFunctions saveToKeychain:@"address" withValue:wallet_address];
      if( (int)sts2 == 0 ){
        NSString *xmss_pk = [NSString stringWithCString:bin2hstr(xmss.getPK()).c_str() encoding:[NSString defaultCStringEncoding]];
        //save wallet address to the keychain
        OSStatus sts3 = [WalletHelperFunctions saveToKeychain:@"xmsspk" withValue:xmss_pk];
        if( (int)sts3 == 0 ){
          NSNumber *tree_height_nb = [NSNumber numberWithInt:xmss.getHeight()];
          NSString *tree_height = [tree_height_nb stringValue];
          //save wallet address to the keychain
          OSStatus sts4 = [WalletHelperFunctions saveToKeychain:@"treeheight" withValue:tree_height];
          if( (int)sts4 == 0 ){
            callback(@[[NSNull null], @"success" ]);
          }
          else {
            NSLog(@"ERROR saving treeheight to keychain: %d",(int)sts4);
            callback(@[[NSNull null], @"error" ]);
          }
        }
        else {
          NSLog(@"ERROR saving xmsspk to keychain: %d",(int)sts3);
          callback(@[[NSNull null], @"error" ]);
        }
      }
      else {
        NSLog(@"ERROR saving address to keychain: %d",(int)sts2);
        callback(@[[NSNull null], @"error" ]);
      }
    }
    else {
      NSLog(@"ERROR saving hexseed to keychain: %d",(int)sts);
      callback(@[[NSNull null], @"error" ]);
    }
  }
  // error in hexseed
  catch (...){
    callback(@[[NSNull null], @"error" ]);
  }
  
}

// close the open wallet before creating a new one
RCT_EXPORT_METHOD(closeWallet: (RCTResponseSenderBlock)callback){
    // remove all the information saved on the keyChain
    NSDictionary *spec = @{(__bridge id)kSecClass:(__bridge id)kSecClassGenericPassword};
    SecItemDelete((__bridge CFDictionaryRef)spec);
    callback(@[[NSNull null], @"success" ]);
}


@end


