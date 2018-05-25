//
//  DilithiumIos.m
//  theQRL
//
//  Created by abilican on 08.02.18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "DilithiumIos.h"
#import <React/RCTLog.h>
#import <dilithium.h>


@implementation DilithiumIos
RCT_EXPORT_MODULE();

// To send constants to RN
//- (NSDictionary *)constantsToExport {
//  return @{@"greeting": @"Welcome to the DevDactic\n React Native Tutorial!"};
//}

RCT_EXPORT_METHOD(getPK: (RCTResponseSenderBlock)callback )
{
  std::vector<unsigned char> message {0, 1, 2, 4, 6, 9, 1};
  Dilithium dt;
  auto message_signed = dt.sign(message);
  NSLog(@"XCODE : message_signed is is : %i", message_signed[0]);
}
@end

