#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(FreeraspReactNative, RCTEventEmitter)

RCT_EXTERN_METHOD(talsecStart:(NSDictionary*)options)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
