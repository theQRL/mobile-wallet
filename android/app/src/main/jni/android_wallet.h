//
// Created by abilican on 22.03.18.
//

#ifndef ANDROID_WALLET_H
#define ANDROID_WALLET_H

#include <string>
#include <qrl/xmssBasic.h>
#include <android/log.h>
#include <jni.h>

#ifdef __cplusplus
extern "C" {
#endif

using namespace std;

class AndroidWallet
{
public:
    AndroidWallet();
    string createWallet(jint treeHeight, jint hashFunction);
    string openWalletWithHexseed(string hexseed);
    string openWalletWithMnemonic(string mnemonic);
    string transferCoins(string address, string amount, int fee, string hexseed, int otsIndex);
    string getMnemonic(string hexseed);
};


#ifdef __cplusplus
}
#endif

#endif