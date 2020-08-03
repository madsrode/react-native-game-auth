#import <React/RCTBridgeModule.h>
#import <GameKit/GameKit.h>

@interface RCT_EXTERN_MODULE(GameAuth, NSObject)

RCT_EXTERN_METHOD(authenticateUser: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(isAuthenticated: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getPlayer: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getServerAuth: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
