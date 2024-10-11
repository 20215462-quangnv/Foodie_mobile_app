### A mobile app developed with React Native

## Setup

- Git clone the repository
- Then open terminal, run script: npm install
- In case you haven't installed expo through npm installation, download and install expo -CLI for later use
- Setup all environment for android (Using android studio), which includes:

* Cmake
* Android SDK build-tool
* Android SDK platform
* Android Emulator
* NDK (side-by-side)
* Android 15 (VanillaCream) and Android 14 (UpsideDownCaked)
* Hermes (optional)

## Building

- Create and start a new device with android studio
- Run script: npm start (npm expo start)
  After running this, expo will take care everything about building and rendering app.
  The first build may take a while.

## Developing

- Every new screen needs to be setup as a new file, with capital first letter
- Several used components must be stored in the same folder
- Icons, pictures should be stored in assets or some similar directory
