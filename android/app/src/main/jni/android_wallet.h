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
    string androidWalletJNI(jint treeHeight, jint hashFunction);
};


#ifdef __cplusplus
}
#endif

#endif