//
//  NSString+Localizable.m
//  Demo
//
//  Created by materik on 26/07/16.
//  Copyright © 2016 materik. All rights reserved.
//

#import "NSString+Localizable.h"

@implementation NSString (Localizable)

- (NSString *)localize {
  return NSLocalizedString(self, nil);
}

@end
