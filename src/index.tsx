import { NativeModules, DeviceEventEmitter } from 'react-native';

interface Player {
  alias: String;
  displayName: String;
  playerID: String;
}

export interface IdentityVerificationSignature {
  publicKeyUrl: String;
  signature: String;
  salt: String;
  timestamp: Number;
}

type GameCenterAuthType = {
  authenticateUser(): Promise<Boolean>;
  isAuthenticated(): Promise<Boolean>;
  getPlayer(): Promise<Player>;
  getServerAuth(): Promise<IdentityVerificationSignature>;
};

type PlayGamesAuthType = {
  signIn(): Promise<boolean>;
  signInSilent(triggerUISignInIfSilentFails: boolean): Promise<boolean>;
  signOut(): Promise<boolean>;
  onAuthStateChanged: (callback: (isSignedIn: boolean) => void) => {};
  onAuthTokenChanged: (callback: (token: string) => void) => {};
  AUTH_STATE_CHANGED_EVENT: string;
  AUTH_TOKEN_CHANGED_EVENT: string;
};

const GameCenterAuth: GameCenterAuthType | undefined = NativeModules.GameAuth;
const PlayGamesAuth: PlayGamesAuthType | undefined =
  NativeModules.PlayGamesAuth;

if (PlayGamesAuth) {
  PlayGamesAuth.onAuthStateChanged = (callback: any) => {
    return DeviceEventEmitter.addListener(
      PlayGamesAuth.AUTH_STATE_CHANGED_EVENT,
      (isSignedIn: boolean) => {
        callback(isSignedIn);
      }
    );
  };

  PlayGamesAuth.onAuthTokenChanged = (callback: any) => {
    return DeviceEventEmitter.addListener(
      PlayGamesAuth.AUTH_TOKEN_CHANGED_EVENT,
      (token: String) => {
        callback(token);
      }
    );
  };
}

export { GameCenterAuth, PlayGamesAuth };
