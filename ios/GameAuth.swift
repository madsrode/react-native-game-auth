import GameKit

@objc(GameAuth)
class GameAuth: NSObject {
    @objc(authenticateUser:rejecter:)
    func authenticateUser(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ) -> Void {
        let ui = UIApplication.shared.keyWindow?.rootViewController;

        let player = GKLocalPlayer.local
        player.authenticateHandler = { vc, error in
            if(vc != nil) {
                ui?.present(vc!, animated: true, completion: nil);
            }
            else {
                if(error == nil) {
                    resolve(player.isAuthenticated)
                } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
                    reject(error?.localizedDescription ?? "", "", error)
                }
            }
        }       
    }

    @objc(isAutheticated:rejecter:)
    func isAuthenticated(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ) -> Void {
        let player = GKLocalPlayer.local
        resolve(player.isAuthenticated)
    }

    @objc(getPlayer:rejecter:)
    func getPlayer(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ) -> Void {
        let player = GKLocalPlayer.local
        if(player.isAuthenticated) {
            let player: NSDictionary = [
                "alias" : player.alias,
                "displayName" : player.displayName,
                "playerID" : player.playerID
            ]
            resolve(player)
        }
        else {
            reject("Unautheticated", "Unautheticated", nil)
        }
    }

    @objc(getServerAuth:rejecter:)
    func getServerAuth(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock ) -> Void {
        let player = GKLocalPlayer.local
        if(player.isAuthenticated) {
            NSLog("in generateIdentityVerificationSignature");
            player.generateIdentityVerificationSignature { (publicKeyUrl, signature, salt, timestamp, e) in
                NSLog("in generateIdentityVerificationSignature");
                
                if(e != nil) {
                    reject("Error", "An error", e);
                }
                else {
                    let data: NSDictionary = [
                        "publicKeyUrl" : publicKeyUrl?.absoluteString ?? "",
                        "signature" : signature?.base64EncodedString(options: Data.Base64EncodingOptions.init(rawValue: 0)) ?? "",
                        "salt" : salt?.base64EncodedString() ?? "",
                        "timestamp": timestamp
                    ]

                    resolve(data);
                }
            }
        }
        else {
            reject("Unauthenticated", "", nil);
        }
    }
}
