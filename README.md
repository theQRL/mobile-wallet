# QRL Mobile wallet

This mobile application is based on the react-native framework to provide an Android and iOS implementation of the QRL wallet.

## How to run generate iOS libraries

To generate the iOS libraries you need to clone the qrllib and build the *.a iOS libraries (for the simulator and real device) using Xcode.

```bash
git clone https://github.com/theQRL/qrllib
git submodule update --init --recursive
cd qrllib
mkdir build
cd build
cmake -G Xcode ..
```
These commands will generate a new Xcode project called qrllib.xcodeproj.
Open the Xcode project and build the 4 different libraries (dilithium, kyber, qrllib and shasha) for the iOS simulator and "iOS generic device". You will see all the generated libraries under build/Debug-iphoneos and build/Debug-iphonesimulator directories.
