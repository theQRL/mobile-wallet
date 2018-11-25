/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "testingEphemeral.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
//
//#import <GRPCClient/GRPCCall+ChannelArg.h>
//#import <GRPCClient/GRPCCall+Tests.h>
//#import <theQRL/Qrl.pbrpc.h>
//
//#import "kyber.h"
//#import "dilithium.h"
//#import "xmss.h"
//#import "xmssBase.h"
//#import "xmssFast.h"
//#import "misc.h"

//static NSString * const kHostAddress = @"104.237.3.185:9009";
////104.251.219.215:9009
////104.237.3.185:9009
////104.251.219.145:9009
////104.251.219.40:9009
//// devnet
//// 35.177.114.111:9009

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"theQRL"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  
  //Clear keychain on first run in case of reinstallation
  if (![[NSUserDefaults standardUserDefaults] objectForKey:@"FirstRun"]) {
    // Delete values from keychain here
    NSDictionary *spec = @{(__bridge id)kSecClass:(__bridge id)kSecClassGenericPassword};
    SecItemDelete((__bridge CFDictionaryRef)spec);
    // Initisate NSUserDefaults, so that it keeps track of the app being uninstalled (to remove keychain values on reinstall)
    [[NSUserDefaults standardUserDefaults] setValue:@"1strun" forKey:@"FirstRun"];
    [[NSUserDefaults standardUserDefaults] synchronize];
  }
  
  
//  [testingEphemeral registerLattice];
  
  return YES;
}

@end

