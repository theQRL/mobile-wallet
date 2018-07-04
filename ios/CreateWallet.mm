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
  
  
  static NSString * const kHostAddress = @"devnet-1.automated.theqrl.org:19009";
  [GRPCCall useInsecureConnectionsForHost:kHostAddress];
  [GRPCCall setUserAgentPrefix:@"HelloWorld/1.0" forHost:kHostAddress];
  PublicAPI *client = [[PublicAPI alloc] initWithHost:kHostAddress];
  
  GetNodeStateReq *getNodeState = [GetNodeStateReq message];
  NSLog(@"Getting tx information...");
  [client getNodeStateWithRequest:getNodeState handler:^(GetNodeStateResp * _Nullable response, NSError * _Nullable error) {
    NSLog(@"REPONSE: %@", response);
  }];

  
  // fixed seed for testing purpose
  // would need to generate the seed on the RN side to avoid code duplication (iOS/Android)
  //std::vector<unsigned char> seed(48, 0);
  //std::vector<unsigned char> seed{102, 65, 247, 49, 207, 202, 238, 179, 240, 134, 211, 146, 226, 21, 198, 52, 63, 231, 75, 110, 155, 124, 95, 115, 180, 39, 158, 190, 10, 176, 240, 7, 54, 219, 160, 221, 93, 88, 226, 148, 70, 105, 242, 252, 209, 55, 227, 56};
  
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
  switch(hashFunctionIndex) {
    case 1: {
      NSLog(@" CREATING WITH SHAKE_128");
      XmssBasic xmss = XmssBasic(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);

      //  XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);

      // get wallet related information
      auto address = bin2hstr(xmss.getAddress());
      auto pk = bin2hstr(xmss.getPK(),16);
      auto sk = bin2hstr(xmss.getSK(),16);
      auto extended_seed = bin2hstr(xmss.getExtendedSeed());
      //  auto extended_seed_mnmonic = bin2mnemonic(xmss.getExtendedSeed());

      // convert the values to NSString to be able to print
      NSString *wallet_address = [NSString stringWithCString:address.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_pk = [NSString stringWithCString:pk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_sk = [NSString stringWithCString:sk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_extendedseed = [NSString stringWithCString:extended_seed.c_str() encoding:[NSString defaultCStringEncoding]];
      //  NSString *wallet_extendedseed_m = [NSString stringWithCString:extended_seed_mnmonic.c_str() encoding:[NSString defaultCStringEncoding]];

      NSLog(@"Wallet address %@", wallet_address);
      NSLog(@"PK %@", wallet_pk);
      NSLog(@"SK %@", wallet_sk);
      NSLog(@"Extended seed %@", wallet_extendedseed);
      //  NSLog(@"Extended seed %@", wallet_extendedseed_m) ;

      // send callback to RN
      callback(@[[NSNull null], wallet_address ]);
      break; //optional
    }
    case 2: {
      NSLog(@" CREATING WITH SHAKE_256");
      XmssBasic xmss = XmssBasic(seed, treeHeightInt, eHashFunction::SHAKE_256, eAddrFormatType::SHA256_2X);
//      XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_256, eAddrFormatType::SHA256_2X);

      //  XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);

      // get wallet related information
      auto address = bin2hstr(xmss.getAddress());
      auto pk = bin2hstr(xmss.getPK(),16);
      auto sk = bin2hstr(xmss.getSK(),16);
      auto extended_seed = bin2hstr(xmss.getExtendedSeed());
      //  auto extended_seed_mnmonic = bin2mnemonic(xmss.getExtendedSeed());

      // convert the values to NSString to be able to print
      NSString *wallet_address = [NSString stringWithCString:address.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_pk = [NSString stringWithCString:pk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_sk = [NSString stringWithCString:sk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_extendedseed = [NSString stringWithCString:extended_seed.c_str() encoding:[NSString defaultCStringEncoding]];
      //  NSString *wallet_extendedseed_m = [NSString stringWithCString:extended_seed_mnmonic.c_str() encoding:[NSString defaultCStringEncoding]];

      NSLog(@"Wallet address %@", wallet_address);
      NSLog(@"PK %@", wallet_pk);
      NSLog(@"SK %@", wallet_sk);
      NSLog(@"Extended seed %@", wallet_extendedseed);
      //  NSLog(@"Extended seed %@", wallet_extendedseed_m);

      // send callback to RN
      callback(@[[NSNull null], wallet_address ]);
      break; //optional
    }
    case 3: {
      XmssBasic xmss = XmssBasic(seed, treeHeightInt, eHashFunction::SHA2_256, eAddrFormatType::SHA256_2X);
//      XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_256, eAddrFormatType::SHA256_2X);

      //  XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);

      // get wallet related information
      auto address = bin2hstr(xmss.getAddress());
      auto pk = bin2hstr(xmss.getPK(),16);
      auto sk = bin2hstr(xmss.getSK(),16);
      auto extended_seed = bin2hstr(xmss.getExtendedSeed());
      //  auto extended_seed_mnmonic = bin2mnemonic(xmss.getExtendedSeed());

      // convert the values to NSString to be able to print
      NSString *wallet_address = [NSString stringWithCString:address.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_pk = [NSString stringWithCString:pk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_sk = [NSString stringWithCString:sk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_extendedseed = [NSString stringWithCString:extended_seed.c_str() encoding:[NSString defaultCStringEncoding]];
      //  NSString *wallet_extendedseed_m = [NSString stringWithCString:extended_seed_mnmonic.c_str() encoding:[NSString defaultCStringEncoding]];

      NSLog(@"Wallet address %@", wallet_address);
      NSLog(@"PK %@", wallet_pk);
      NSLog(@"SK %@", wallet_sk);
      NSLog(@"Extended seed %@", wallet_extendedseed);
      //  NSLog(@"Extended seed %@", wallet_extendedseed_m);

      // send callback to RN
      callback(@[[NSNull null], wallet_address ]);
      break;
    }
    default : {//Optional
      XmssBasic xmss = XmssBasic(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);

      //  XmssBasic xmss(seed, treeHeightInt, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);

      // get wallet related information
      auto address = bin2hstr(xmss.getAddress());
      auto pk = bin2hstr(xmss.getPK(),16);
      auto sk = bin2hstr(xmss.getSK(),16);
      auto extended_seed = bin2hstr(xmss.getExtendedSeed());
      //  auto extended_seed_mnmonic = bin2mnemonic(xmss.getExtendedSeed());

      // convert the values to NSString to be able to print
      NSString *wallet_address = [NSString stringWithCString:address.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_pk = [NSString stringWithCString:pk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_sk = [NSString stringWithCString:sk.c_str() encoding:[NSString defaultCStringEncoding]];
      NSString *wallet_extendedseed = [NSString stringWithCString:extended_seed.c_str() encoding:[NSString defaultCStringEncoding]];
      //  NSString *wallet_extendedseed_m = [NSString stringWithCString:extended_seed_mnmonic.c_str() encoding:[NSString defaultCStringEncoding]];

      NSLog(@"Wallet address %@", wallet_address);
      NSLog(@"PK %@", wallet_pk);
      NSLog(@"SK %@", wallet_sk);
      NSLog(@"Extended seed %@", wallet_extendedseed);
      //  NSLog(@"Extended seed %@", wallet_extendedseed_m);

      // send callback to RN
      callback(@[[NSNull null], wallet_address ]);
    }
  }

//  XmssBasic xmss(seed, treeHeight, eHashFunction::SHAKE_128, eAddrFormatType::SHA256_2X);
//
//  // get wallet related information
//  auto address = bin2hstr(xmss.getAddress());
//  auto pk = bin2hstr(xmss.getPK(),16);
//  auto sk = bin2hstr(xmss.getSK(),16);
//  auto extended_seed = bin2hstr(xmss.getExtendedSeed());
////  auto extended_seed_mnmonic = bin2mnemonic(xmss.getExtendedSeed());
//
//  // convert the values to NSString to be able to print
//  NSString *wallet_address = [NSString stringWithCString:address.c_str() encoding:[NSString defaultCStringEncoding]];
//  NSString *wallet_pk = [NSString stringWithCString:pk.c_str() encoding:[NSString defaultCStringEncoding]];
//  NSString *wallet_sk = [NSString stringWithCString:sk.c_str() encoding:[NSString defaultCStringEncoding]];
//  NSString *wallet_extendedseed = [NSString stringWithCString:extended_seed.c_str() encoding:[NSString defaultCStringEncoding]];
////  NSString *wallet_extendedseed_m = [NSString stringWithCString:extended_seed_mnmonic.c_str() encoding:[NSString defaultCStringEncoding]];
//
//  NSLog(@"Wallet address %@", wallet_address);
//  NSLog(@"PK %@", wallet_pk);
//  NSLog(@"SK %@", wallet_sk);
//  NSLog(@"Extended seed %@", wallet_extendedseed);
////  NSLog(@"Extended seed %@", wallet_extendedseed_m);
//
//  // send callback to RN
//  callback(@[[NSNull null], wallet_address ]);

}

@end

