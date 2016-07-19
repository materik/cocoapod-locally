//
//  ViewController.m
//  Demo
//
//  Created by materik on 19/02/16.
//  Copyright © 2016 materik. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
  [super viewDidLoad];

  NSLocalizedString(@"Profile Title", nil);
  NSLocalizedString(@"New String", nil);
  NSLocalizedString(@"New String", @"Duplicate");
  @"Other New String".localize
}

@end
