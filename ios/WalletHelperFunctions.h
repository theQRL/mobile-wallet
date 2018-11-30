//
//  WalletHelperFunctions.h
//  theQRL
//
//  Created by abilican on 20.09.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#ifndef WalletHelperFunctions_h
#define WalletHelperFunctions_h

@interface WalletHelperFunctions : NSObject {}
extern NSString * const kHostAddress;
extern NSNumber * const shor;
+ (void)printTest;
+ (NSString *) nsDataHex2string:(NSData *)nsDataHex ;
+ (NSMutableData *) nsStringHex2nsData:(NSString *)nsStringHex ;
+ (NSMutableString *) nsStringHex2ascii:(NSString *)nsStringHex ;
+ (NSString *) formatDate:(NSTimeInterval)timestamp;
+ (OSStatus) removeFromKeychain:(NSString *)account;
+ (OSStatus) saveToKeychain:(NSString *)account withValue:(NSString *)value;
+ (OSStatus) saveIntToKeychain:(NSString *)account withValue:(NSNumber *)value;
+ (NSString *) getFromKeychain:(NSString *)account;
+ (NSString*)hexToBinary:(NSString*)hexString;
@end

#endif /* WalletHelperFunctions_h */
