//
//  KyberIos.m
//  theQRL
//
//  Created by abilican on 01.02.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "KyberIos.h"
#import <React/RCTLog.h>
#import <kyber.h>


@implementation KyberIos
RCT_EXPORT_MODULE();

// To send constants to RN
//- (NSDictionary *)constantsToExport {
//  return @{@"greeting": @"Welcome to the DevDactic\n React Native Tutorial!"};
//}

RCT_EXPORT_METHOD(getPK: (RCTResponseSenderBlock)callback )
{
  Kyber alice;
  auto alicePublicKey = alice.getPK();

  NSLog(@"XCODE : alicePublicKey[0] is : %i", alicePublicKey[0]);
  callback(@[[NSNull null], @(alicePublicKey[0]) ]);
}
@end
