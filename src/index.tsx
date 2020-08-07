import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

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

type PlayGamesAuthType = {
  signIn(): Promise<boolean>;
  signInSilent(triggerUISignInIfSilentFails: boolean): Promise<boolean>;
  signOut(): Promise<boolean>;
  onAuthStateChanged: (callback: (isSignedIn: boolean) => void) => {};
  onAuthTokenChanged: (callback: (token: string) => void) => {};
  AUTH_STATE_CHANGED_EVENT: string;
  AUTH_TOKEN_CHANGED_EVENT: string;
};

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

if (NativeModules.GameAuth) {
  NativeModules.GameAuth.onAuthenticate = (
    callback: (isAuthenticated: boolean) => void
  ): EmitterSubscription => {
    const e = new NativeEventEmitter(NativeModules.GameAuth);
    return e.addListener('OnAuthenticate', (data: any) => {
      callback(data.isAuthenticated);
    });
  };
}

type GameCenterAuthType = {
  initAuth(): void;
  isAuthenticated(): Promise<Boolean>;
  getPlayer(): Promise<Player>;
  getServerAuth(): Promise<IdentityVerificationSignature>;
  onAuthenticate(
    callback: (isAuthenticated: boolean) => void
  ): EmitterSubscription;
};

const GameCenterAuth: GameCenterAuthType | undefined = NativeModules.GameAuth;

export { GameCenterAuth, PlayGamesAuth };
