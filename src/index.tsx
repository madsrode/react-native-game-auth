import { NativeModules } from 'react-native';

type GameAuthType = {
  multiply(a: number, b: number): Promise<number>;
};

const { GameAuth } = NativeModules;

export default GameAuth as GameAuthType;
