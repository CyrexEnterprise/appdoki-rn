<p align="center">
  <img src="https://avatars.githubusercontent.com/u/12516144?s=100" style="border-radius: 8px;">
  <h1 align="center">Appdoki</h1>
  <h3 align="center">Cloudoki &middot; Hackfridays &middot; Mobile Dev</h3>
</p>

<br />

## Setup

Create a `.env` at the root of the project, check the contents of `.env.sample`:
```bash
# then update the .env file variables
cp .env.sample .env
```

<br />

Create a `notifee.config.json` at the root of the project with the following:
```json
{
  "android": {
    "license": "<YOUR_LICENSE_KEY>"
  },
  "ios": {
    "license": "<YOUR_LICENSE_KEY>"
  }
}

```

<br >

### ios
Download `GoogleService-Info.plist` from firebase and add it to `ios` folder.

<br />

Follow the steps in [appdoki-rn-certs](https://github.com/Cloudoki/appdoki-rn-certs) to setup your keys.

<br />

### android
Download `google-services.json` from firebase and add it to `android/app` folder.

<br />

Debug keystore is included in the project. For production builds add the following to `~/.gradle/gradle.properties`:

```properties
# ~/.gradle/gradle.properties
# Replace <...> with correct values.
APPDOKI_RELEASE_STORE_FILE=/<ABSOLUTE_PATH_TO>/<YOUR_KEY>.keystore
APPDOKI_RELEASE_KEY_ALIAS=<KEY_ALIAS>
APPDOKI_RELEASE_STORE_PASSWORD=<STORE_PASSWORD>
APPDOKI_RELEASE_KEY_PASSWORD=<KEY_PASSWORD>
```

<br />

## Development

```bash
# install dependencies
yarn && cd ./ios; pod install; cd ..
```

<br />

**Open a new terminal window then run the bundler:**
```bash
# start metro bundler
yarn start
```

<br />

Reactotron configuration is setup, checkout [reactotron](https://github.com/infinitered/reactotron) for instructions on how to use ti.

<br />

### ios
```bash
yarn ios
```

<br />

### android
```bash
yarn android
```

<br />

## Release

Checkout the tag you want to release:
```bash
git checkout <TAG> # e.g: v1.0.1-alpha.0
```

<br>

Follow the steps in [fastlane readme](https://github.com/Cloudoki/appdoki-rn/blob/master/fastlane/README.md). **Note:** for `alpha` lanes you need to [login on firebase](https://firebase.google.com/docs/cli#sign-in-test-cli).
