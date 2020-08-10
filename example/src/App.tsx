import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { GameCenterAuth, PlayGamesAuth } from 'react-native-game-auth';

export default function App() {
  const [result, setResult] = React.useState<Boolean | undefined>(undefined);
  const [json, setJson] = React.useState<string | undefined>();

  const psAuthStateChanged = (isSignedIn: boolean): void => {
    console.log('psAuth', isSignedIn);
  };
  const psAuthTokenChanged = (s: string) => {
    console.log('psAuthToken', s);
  };

  React.useEffect(() => {
    if (PlayGamesAuth) {
      PlayGamesAuth.onAuthStateChanged(psAuthStateChanged);
      PlayGamesAuth.onAuthTokenChanged(psAuthTokenChanged);
    }

    if (GameCenterAuth) {
      const x = GameCenterAuth.onAuthenticate((i) => {
        setResult(i);
      });
      GameCenterAuth.initAuth(false);
      return () => {
        x.remove();
      };
    }

    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Text>{result ? 'Authenticated' : 'Not authenticated ' + result}</Text>
      <Button
        title="getPlayer"
        onPress={() => {
          GameCenterAuth?.isAuthenticated().then((x) =>
            console.log('isAuthen', x)
          );
          GameCenterAuth?.initAuth(true);
          GameCenterAuth?.isAuthenticated();
          // GameCenterAuth?.getPlayer()
          //   .then((x) => setJson(JSON.stringify(x)))
          //   .catch((x) => console.warn(x));
        }}
      />
      <Button
        title="getServerAuth"
        onPress={() => {
          GameCenterAuth?.getServerAuth()
            .then((x) => setJson(JSON.stringify(x)))
            .catch((x) => console.warn(x));
        }}
      />
      <Button
        title="getServerAuth"
        onPress={() => {
          PlayGamesAuth?.signInSilent(true)
            .then((x: any) => setJson(JSON.stringify(x)))
            .catch((x: any) => console.warn(x));
        }}
      />
      <Text>JSON: {json}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
