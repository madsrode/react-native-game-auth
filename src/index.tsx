import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

interface Player {
  alias: string;
  displayName: string;
  playerID: string;
}

export interface IdentityVerificationSignature {
  publicKeyUrl: string;
  signature: string;
  salt: string;
  timestamp: number;
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
      (token: string) => {
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
  initAuth(showUIIfUnauthenticated: boolean): void;
  isAuthenticated(): Promise<boolean>;
  getPlayer(): Promise<Player>;
  getServerAuth(): Promise<IdentityVerificationSignature>;
  onAuthenticate(
    callback: (isAuthenticated: boolean, error?: string) => void
  ): EmitterSubscription;
};

const GameCenterAuth: GameCenterAuthType | undefined = NativeModules.GameAuth;

export { GameCenterAuth, PlayGamesAuth };
