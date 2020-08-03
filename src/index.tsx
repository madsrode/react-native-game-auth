import { NativeModules } from 'react-native';

interface Player {
  alias: String;
  displayName: String;
  playerID: String;
}

interface IdentityVerificationSignature {
  publicKeyUrl: String;
  signature: String;
  salt: String;
  timestamp: Number;
}

type GameAuthType = {
  authenticateUser(): Promise<Boolean>;
  isAuthenticated(): Promise<Boolean>;
  getPlayer(): Promise<Player>;
  getServerAuth(): Promise<IdentityVerificationSignature>;
};

const { GameAuth } = NativeModules;

export default GameAuth as GameAuthType;
