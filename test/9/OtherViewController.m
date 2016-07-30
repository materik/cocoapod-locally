//
//  ViewController.m
//  Demo
//
//  Created by materik on 19/02/16.
//  Copyright © 2016 materik. All rights reserved.
//

#import "OtherViewController.h"

#import "NSString+Localizable.h"

@interface OtherViewController ()

@end

@implementation OtherViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  NSLog(@"%@", NSLocalizedString(@"Used String", nil));
  NSLog(@"%@", NSLocalizedString(@"Other New String", nil));
}

@end
