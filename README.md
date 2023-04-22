
# Plex Manager

A cross-platform app build in [React Native](https://reactnative.dev/), based on the [Plex API](https://www.plexopedia.com/plex-media-server/api/) for managing Plex Media Servers from a phone.
## Install

- Play Store : Coming soon
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
    - [ ] Server Capabilities
    - [X] Server Identity
    - [X] Server Preferences
    - [X] Get Accounts
    - [X] Get a Single Account
    - [X] Get Devices
    - [ ] ~~Get a Single Device~~ (No additional infos)
    - [X] Get All Activities
    - [ ] Stop an Activity
- Session
    - [ ] Get Active Sessions
    - [ ] Get All Transcode Sessions
    - [ ] Terminate a Session
- Library
    - [X] Get Libraries
    - [X] Scan All Libraries
    - [X] Scan a Single Library
    - [X] Refresh Metadata for a Library
- Media
    - [X] Get All Movies
    - [ ] Get Newest Movies
    - [ ] Update Movie Details
    - [X] Get All TV Shows
    - [ ] Get All TV Show Seasons
    - [ ] Get All TV Show Episodes
    - [X] Get All Music Artists
    - [X] Get All Photos
    - [X] Get All Videos
    - [ ] Update Media Play Progress
- Playlists
    - [ ] View Playlists for a User
    - [ ] View a Single Playlist
    - [ ] View Items in a Playlist
- Maintenance
    - [ ] Empty trash
    - [ ] Clean Bundles
    - [ ] Optimize Database
- Scheduled Tasks
    - [ ] Get All Scheduled Tasks
    - [ ] Run Backup Database Task
- Troubleshooting
    - [ ] Download the Databases
    - [ ] Download the Logs

## Authors

- [@sikelio](https://www.github.com/sikelio)

## Supports

### Android
The app is configured to be installed on Android >= 5.0 (SDK 21) but the app is currently tested on an Android 33 version. Some tests, will be done in the future. If you are getting trouble to install the app, please open an issue.

### iOS
I don't own an Apple device and an Apple developer licence for publishing the app on the App Store. For this reason the app is currently not available for iOS devices.
## License

[GLP v3](https://choosealicense.com/licenses/gpl-3.0/)
