import GameKit

@objc(GameAuth)
class GameAuth: RCTEventEmitter {
  let C_OnAuthenticated: String = "OnAuthenticate";

  open override func supportedEvents() -> [String] {
    return [self.C_OnAuthenticated];
  }

    @objc
    func initAuth() {
        let ui = UIApplication.shared.keyWindow?.rootViewController;

        let player = GKLocalPlayer.local
        player.authenticateHandler = { vc, error in
            if(vc != nil) {
                ui?.present(vc!, animated: true, completion: nil);
            }
            else {
                self.sendEvent(withName: self.C_OnAuthenticated, body: ["isAuthenticated":player.isAuthenticated, "error": error])
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

    @objc static override func requiresMainQueueSetup() -> Bool {
        return true 
    } 
}
