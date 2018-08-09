//
//  rehreshWallet.h
//  theQRL
//
//  Created by abilican on 17.05.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface IosWallet : NSObject <RCTBridgeModule>
+ (NSString *) nsDataHex2string:(NSData *)nsDataHex ;
+ (NSMutableData *) nsStringHex2nsData:(NSString *)nsStringHex ;
+ (NSMutableString *) nsStringHex2ascii:(NSString *)nsStringHex ;
+ (NSString *) formatDate:(NSTimeInterval)timestamp;
@end
