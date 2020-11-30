# react-native-game-auth

Getting auth for serverside for both Google Play Games and Apple Game Center

## Installation

```sh
npm install react-native-game-auth
```

## Usage

```js
import { GameCenterAuth, PlayGamesAuth } from 'react-native-game-auth';

React.useEffect(() => {
  if (PlayGamesAuth) {
    PlayGamesAuth.onAuthStateChanged((isSignedIn: boolean): void => {
      console.log('Play Games Auth State Changed', isSignedIn);
    });
    PlayGamesAuth.onAuthTokenChanged((s: string) => {
      console.log('Play Games AuthToken', s);
    });
  }

  if (GameCenterAuth) {
    const x = GameCenterAuth.onAuthenticate((i) => {
      console.log('Game Center auth status:', i)
    });
    GameCenterAuth.initAuth();

    return () => {
      x.remove();
    };
  }

  return () => {};
}, []);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
