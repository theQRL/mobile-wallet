/* DO NOT EDIT THIS FILE - it is machine generated */
#include <jni.h>
#include <string>
/* Header for class com_jnisample_JNIHelloWorld_JNIActivity */


#ifndef _Included_com_theqrl_AndroidWalletModule
#define _Included_com_theqrl_AndroidWalletModule

#ifdef __cplusplus
extern "C" {
#endif

JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_createWallet(JNIEnv *, jobject, jint, jint);
JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_transferCoins(JNIEnv *, jobject, jstring, jstring, jint, jstring, jint);
JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_openWalletWithHexseed(JNIEnv* , jobject, jstring);
JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_openWalletWithMnemonic(JNIEnv* , jobject, jstring);
JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_getMnemonic(JNIEnv* , jobject, jstring);
#ifdef __cplusplus
}
#endif

#endif