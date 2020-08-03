import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import GameAuth from 'react-native-game-auth';

export default function App() {
  const [result, setResult] = React.useState<Boolean | undefined>();
  const [json, setJson] = React.useState<string | undefined>();

  React.useEffect(() => {
    GameAuth.authenticateUser()
      .then((x) => setResult(x))
      .catch((e) => console.log('e', JSON.stringify(e)));
  }, []);

  return (
    <View style={styles.container}>
      <Text>{result ? 'Authenticated' : 'Not authenticated'}</Text>
      <Button
        title="getPlayer"
        onPress={() => {
          GameAuth.getPlayer()
            .then((x) => setJson(JSON.stringify(x)))
            .catch((x) => console.warn(x));
        }}
      />
      <Button
        title="getServerAuth"
        onPress={() => {
          GameAuth.getServerAuth()
            .then((x) => setJson(JSON.stringify(x)))
            .catch((x) => console.warn(x));
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
