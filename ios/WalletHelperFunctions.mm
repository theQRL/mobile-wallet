//
//  WaleltHelperFunctions.m
//  theQRL
//
//  Created by abilican on 20.09.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "WalletHelperFunctions.h"
#import "misc.h"

@implementation WalletHelperFunctions

NSString * const kHostAddress = @"testnet-2.automated.theqrl.org:19009";
NSNumber * const shor = @1000000000;

+ (void) printTest {
  NSLog(@"test");
}


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

// save value to keychain
+ (OSStatus) saveToKeychain:(NSString *)account withValue:(NSString *)value{
  // saving the hexSeed to the kexchain
  NSMutableDictionary *keychainItem = [NSMutableDictionary dictionary];
  keychainItem[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword;
  keychainItem[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleWhenUnlocked;
  keychainItem[(__bridge id)kSecAttrAccount] = account;
  keychainItem[(__bridge id)kSecValueData] = [value dataUsingEncoding:NSUTF8StringEncoding];
  OSStatus sts = SecItemAdd((__bridge CFDictionaryRef)keychainItem, NULL);
  return sts;
}

// remove item from keychain
+ (OSStatus) removeFromKeychain:(NSString *)account{
  // saving the hexSeed to the kexchain
  NSMutableDictionary *keychainItem = [NSMutableDictionary dictionary];
  keychainItem[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword;
  keychainItem[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleWhenUnlocked;
  keychainItem[(__bridge id)kSecAttrAccount] = account;
  OSStatus sts = SecItemDelete((__bridge CFDictionaryRef)keychainItem);
  return sts;
}


// save nsnumber value to keychain
+ (OSStatus) saveIntToKeychain:(NSString *)account withValue:(NSNumber *)value{
  // saving the hexSeed to the kexchain
  NSMutableDictionary *keychainItem = [NSMutableDictionary dictionary];
  keychainItem[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword;
  keychainItem[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleWhenUnlocked;
  keychainItem[(__bridge id)kSecAttrAccount] = account;
  keychainItem[(__bridge id)kSecValueData] = value;
  OSStatus sts = SecItemAdd((__bridge CFDictionaryRef)keychainItem, NULL);
  return sts;
}

// retrieve value from keychain
+ (NSString *) getFromKeychain:(NSString *)account {
  NSMutableDictionary *keychainItem = [NSMutableDictionary dictionary];
  //Populate it with the data and the attributes we want to use.
  keychainItem[(__bridge id)kSecClass] = (__bridge id)kSecClassGenericPassword; // We specify what kind of keychain item this is.
  keychainItem[(__bridge id)kSecAttrAccessible] = (__bridge id)kSecAttrAccessibleWhenUnlocked;
  keychainItem[(__bridge id)kSecAttrAccount] = account;
  keychainItem[(__bridge id)kSecReturnData] = (__bridge id)kCFBooleanTrue;
  keychainItem[(__bridge id)kSecReturnAttributes] = (__bridge id)kCFBooleanTrue;
  
  CFDictionaryRef result = nil;
  OSStatus sts = SecItemCopyMatching((__bridge CFDictionaryRef)keychainItem, (CFTypeRef *)&result);
  if(sts == noErr){
    NSDictionary *resultDict = (__bridge_transfer NSDictionary *)result;
    NSData *hexseeddata = resultDict[(__bridge id)kSecValueData];
    NSString *hexseed = [[NSString alloc] initWithData:hexseeddata encoding:NSUTF8StringEncoding];
    return hexseed;
  }
  else{
    return @"error";
  }

}


// convert hexstring to binary
+ (NSString*)hexToBinary:(NSString*)hexString {
  NSMutableString *retnString = [NSMutableString string];
  for(int i = 0; i < [hexString length]; i++) {
    char c = [[hexString lowercaseString] characterAtIndex:i];
    switch(c) {
      case '0': [retnString appendString:@"0000"]; break;
      case '1': [retnString appendString:@"0001"]; break;
      case '2': [retnString appendString:@"0010"]; break;
      case '3': [retnString appendString:@"0011"]; break;
      case '4': [retnString appendString:@"0100"]; break;
      case '5': [retnString appendString:@"0101"]; break;
      case '6': [retnString appendString:@"0110"]; break;
      case '7': [retnString appendString:@"0111"]; break;
      case '8': [retnString appendString:@"1000"]; break;
      case '9': [retnString appendString:@"1001"]; break;
      case 'a': [retnString appendString:@"1010"]; break;
      case 'b': [retnString appendString:@"1011"]; break;
      case 'c': [retnString appendString:@"1100"]; break;
      case 'd': [retnString appendString:@"1101"]; break;
      case 'e': [retnString appendString:@"1110"]; break;
      case 'f': [retnString appendString:@"1111"]; break;
      default : break;
    }
  }
  
  return retnString;
}











@end
