//
//  Kyber.m
//  theQRL
//
//  Created by abilican on 01.02.18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Kyber.h"
#import <React/RCTLog.h>

@implementation Kyber

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(addEvent:(NSString *)name location:(NSString *)location)
{
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
}
@end
