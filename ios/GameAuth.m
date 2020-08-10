#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <GameKit/GameKit.h>

@interface RCT_EXTERN_MODULE(GameAuth, RCTEventEmitter)

RCT_EXTERN_METHOD(initAuth: (BOOL)showUIIfUnauthenticated)
RCT_EXTERN_METHOD(isAuthenticated: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getPlayer: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getServerAuth: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
