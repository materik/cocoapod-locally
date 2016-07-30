//
//  ViewController.m
//  Demo
//
//  Created by materik on 19/02/16.
//  Copyright © 2016 materik. All rights reserved.
//

#import "ViewController.h"

#import "NSString+Localizable.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  NSLog(@"%@", NSLocalizedString(@"Used String", nil));
  NSLog(@"%@", NSLocalizedString(@"New String", nil));
}

@end
