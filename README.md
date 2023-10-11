
# Plex Manager

A cross-platform app build in [React Native](https://reactnative.dev/), based on the [Plex API](https://www.plexopedia.com/plex-media-server/api/) for managing Plex Media Servers from a phone.

| Labels      | Version    | Branch                                                                |
|-------------|------------|-----------------------------------------------------------------------|
| Current     | 0.0.2-beta | [v0.0.2-beta](https://github.com/sikelio/plexmanager/tree/0.0.2-beta) |
| Development | 0.0.3-beta | [dev](https://github.com/sikelio/plexmanager/tree/dev)                |

## Install

- Play Store : [Open Beta](https://play.google.com/store/apps/details?id=wtf.plexmanager)
- App Store : [One day may be...](#ios)
## Run

Clone the project

```bash
git clone https://github.com/sikelio/plexmanager
```

Go to the project directory

```bash
cd plex-manager
```

Install dependencies

```bash
yarn install
```

Start the app

- Android :
```bash
yarn android
```

- IOS
```bash
yarn ios
```

## Documentation

Coming soon...

## Features

- Server
    - [ ] [Server Capabilities](https://github.com/sikelio/plexmanager/issues/1)
    - [X] [Server Identity](https://github.com/sikelio/plexmanager/issues/2)
    - [X] [Server Preferences](https://github.com/sikelio/plexmanager/issues/3)
    - [X] [Get Accounts](https://github.com/sikelio/plexmanager/issues/4)
    - [X] [Get a Single Account](https://github.com/sikelio/plexmanager/issues/4)
    - [X] [Get Devices](https://github.com/sikelio/plexmanager/issues/5)
    - [ ] [~~Get a Single Device~~ (No additional infos)](https://github.com/sikelio/plexmanager/issues/6)
    - [ ] [Get All Activities](https://github.com/sikelio/plexmanager/issues/7)
    - [ ] [Stop an Activity](https://github.com/sikelio/plexmanager/issues/8)
    - [ ] [Get Transient Token](https://github.com/sikelio/plexmanager/issues/60)
    - [ ] [Perform Search](https://github.com/sikelio/plexmanager/issues/61)
- Session
    - [X] [Get Active Sessions](https://github.com/sikelio/plexmanager/issues/9)
    - [ ] [Get All Transcode Sessions](https://github.com/sikelio/plexmanager/issues/10)
    - [ ] [Terminate a Session](https://github.com/sikelio/plexmanager/issues/11)
    - [X] [Get Session History](https://github.com/sikelio/plexmanager/issues/62)
- Library
    - [X] [Get Libraries](https://github.com/sikelio/plexmanager/issues/12)
    - [X] [Scan All Libraries](https://github.com/sikelio/plexmanager/issues/45)
    - [X] [Scan a Single Library](https://github.com/sikelio/plexmanager/issues/46)
    - [X] [Refresh Metadata for a Library](https://github.com/sikelio/plexmanager/issues/12)
- Media
    - [X] [Get All Movies](https://github.com/sikelio/plexmanager/issues/13)
    - [ ] [Get Newest Movies](https://github.com/sikelio/plexmanager/issues/14)
    - [ ] [Update Movie Details](https://github.com/sikelio/plexmanager/issues/15)
    - [X] [Get All TV Shows](https://github.com/sikelio/plexmanager/issues/16)
    - [X] [Get All TV Show Seasons](https://github.com/sikelio/plexmanager/issues/17)
    - [X] [Get All TV Show Episodes](https://github.com/sikelio/plexmanager/issues/18)
    - [X] [Get All Music Artists](https://github.com/sikelio/plexmanager/issues/19)
    - [X] [Get All Photos](https://github.com/sikelio/plexmanager/issues/20)
    - [X] [Get All Videos](https://github.com/sikelio/plexmanager/issues/21)
    - [ ] [Update Media Play Progress](https://github.com/sikelio/plexmanager/issues/22)
- Playlists
    - [ ] [Create a Playlist for a User](https://github.com/sikelio/plexmanager/issues/63)
    - [ ] [View Playlists for a User](https://github.com/sikelio/plexmanager/issues/23)
    - [ ] [View a Single Playlist](https://github.com/sikelio/plexmanager/issues/24)
    - [ ] [View Items in a Playlist](https://github.com/sikelio/plexmanager/issues/25)
- Maintenance
    - [X] [Empty trash](https://github.com/sikelio/plexmanager/issues/26)
    - [X] [Clean Bundles](https://github.com/sikelio/plexmanager/issues/27)
    - [X] [Optimize Database](https://github.com/sikelio/plexmanager/issues/28)
- Scheduled Tasks
    - [X] [Get All Scheduled Tasks](https://github.com/sikelio/plexmanager/issues/29)
    - [X] [Run Backup Database Task](https://github.com/sikelio/plexmanager/issues/30)
    - [ ] [Stop All Scheduled Tasks](https://github.com/sikelio/plexmanager/issues/64)
    - [ ] [Run Backup Database Task](https://github.com/sikelio/plexmanager/issues/65)
    - [ ] [Stop Backup Database Task](https://github.com/sikelio/plexmanager/issues/66)
    - [ ] [Run Optimize Database Task](https://github.com/sikelio/plexmanager/issues/67)
    - [ ] [Stop Optimize Database Task](https://github.com/sikelio/plexmanager/issues/68)
    - [ ] [Run Clean Old Bundles Task](https://github.com/sikelio/plexmanager/issues/69)
    - [ ] [Stop Clean Old Bundles Task](https://github.com/sikelio/plexmanager/issues/70)
    - [ ] [Run Clean Old Cache Files Task](https://github.com/sikelio/plexmanager/issues/71)
    - [ ] [Stop Clean Old Cache Files Task](https://github.com/sikelio/plexmanager/issues/72)
    - [ ] [Run Refresh Libraries Task](https://github.com/sikelio/plexmanager/issues/73)
    - [ ] [Stop Refresh Libraries Task](https://github.com/sikelio/plexmanager/issues/74)
- Troubleshooting
    - [X] [Download the Databases](https://github.com/sikelio/plexmanager/issues/31)
    - [X] [Download the Logs](https://github.com/sikelio/plexmanager/issues/32)

## Authors

- [@sikelio](https://www.github.com/sikelio)

## Supports

### Android
The app is configured to be installed on Android >= 5.0 (SDK 21) but the app is currently tested on an Android 33 version. Some tests, will be done in the future. If you are getting trouble to install the app, please open an issue.

### iOS
I don't own an Apple device and an Apple developer licence for publishing the app on the App Store. For this reason the app is currently not available for iOS devices.
## License

[GLP v3](https://choosealicense.com/licenses/gpl-3.0/)
