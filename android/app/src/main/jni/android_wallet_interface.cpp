
#include "android_wallet_interface.h"
#include "android_wallet.h"
//#include "android_wallet.h"

//#include "android_wallet.h"
//#include <qrl/xmssBase.h>
//#include <qrl/xmssFast.h>
//#include <qrl/hashing.h>
#include <qrl/misc.h>
#include <qrl/xmssBasic.h>



#ifdef __cplusplus
extern "C" {
#endif

// JNI entries implementation

JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_createWallet(JNIEnv* pEnv, jobject pThis, jint treeHeight, jint hashFunction)
{
    AndroidWallet androidWallet;
    return pEnv-> NewStringUTF(androidWallet.createWallet(treeHeight, hashFunction).c_str());

    //printf("Hello World from C function!\n");
    //return pEnv-> NewStringUTF("Ho Ho Hoooo");

    //return pEnv-> NewStringUTF((const char *) treeHeight);
    //return (*pEnv) -> NewStringUTF(pEnv, "sdfsdf");
    //return pEnv->NewStringUTF(hello.helloWorldJNI().c_str());
}

// open existing wallet with hexseed
JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_openWalletWithHexseed(JNIEnv* pEnv, jobject pThis, jstring hexseed)
{
    AndroidWallet androidWallet;
    // convert jstring to string
    const jclass stringClass = pEnv->GetObjectClass(hexseed);
    const jmethodID getBytes = pEnv->GetMethodID(stringClass, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytes = (jbyteArray) pEnv->CallObjectMethod(hexseed, getBytes, pEnv->NewStringUTF("UTF-8"));
    size_t length = (size_t) pEnv->GetArrayLength(stringJbytes);
    jbyte* pBytes = pEnv->GetByteArrayElements(stringJbytes, NULL);
    std::string ret = std::string((char *)pBytes, length);
    pEnv->ReleaseByteArrayElements(stringJbytes, pBytes, JNI_ABORT);
    pEnv->DeleteLocalRef(stringJbytes);
    pEnv->DeleteLocalRef(stringClass);

    return pEnv-> NewStringUTF(androidWallet.openWalletWithHexseed(ret).c_str());
}





JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_transferCoins(JNIEnv* pEnv, jobject pThis, jstring address, jstring amount, jint fee, jstring hexseed, jint otsIndex)
{
    // convert jstring to string
    const jclass stringClass = pEnv->GetObjectClass(hexseed);
    const jmethodID getBytes = pEnv->GetMethodID(stringClass, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytes = (jbyteArray) pEnv->CallObjectMethod(hexseed, getBytes, pEnv->NewStringUTF("UTF-8"));
    size_t length = (size_t) pEnv->GetArrayLength(stringJbytes);
    jbyte* pBytes = pEnv->GetByteArrayElements(stringJbytes, NULL);
    std::string ret = std::string((char *)pBytes, length);
    pEnv->ReleaseByteArrayElements(stringJbytes, pBytes, JNI_ABORT);
    pEnv->DeleteLocalRef(stringJbytes);
    pEnv->DeleteLocalRef(stringClass);

    // convert jstring to string
    const jclass stringClassAddr = pEnv->GetObjectClass(address);
    const jmethodID getBytesAddr = pEnv->GetMethodID(stringClassAddr, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytesAddr = (jbyteArray) pEnv->CallObjectMethod(address, getBytesAddr, pEnv->NewStringUTF("UTF-8"));
    size_t lengthAddr = (size_t) pEnv->GetArrayLength(stringJbytesAddr);
    jbyte* pBytesAddr = pEnv->GetByteArrayElements(stringJbytesAddr, NULL);
    std::string retAddr = std::string((char *)pBytesAddr, lengthAddr);
    pEnv->ReleaseByteArrayElements(stringJbytesAddr, pBytesAddr, JNI_ABORT);
    pEnv->DeleteLocalRef(stringJbytesAddr);
    pEnv->DeleteLocalRef(stringClassAddr);

    // convert jstring to string AMOUNT
    const jclass stringClassAmount = pEnv->GetObjectClass(amount);
    const jmethodID getBytesAmount = pEnv->GetMethodID(stringClassAmount, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytesAmount = (jbyteArray) pEnv->CallObjectMethod(amount, getBytesAmount, pEnv->NewStringUTF("UTF-8"));
    size_t lengthAmount = (size_t) pEnv->GetArrayLength(stringJbytesAmount);
    jbyte* pBytesAmount = pEnv->GetByteArrayElements(stringJbytesAmount, NULL);
    std::string retAmount = std::string((char *)pBytesAmount, lengthAmount);
    pEnv->ReleaseByteArrayElements(stringJbytesAmount, pBytesAmount, JNI_ABORT);
    pEnv->DeleteLocalRef(stringJbytesAmount);
    pEnv->DeleteLocalRef(stringClassAmount);

    AndroidWallet androidWallet;
    return pEnv-> NewStringUTF( androidWallet.transferCoins(retAddr, retAmount, fee, ret, otsIndex).c_str() );
}


JNIEXPORT jstring JNICALL Java_com_theqrl_AndroidWalletModule_getMnemonic(JNIEnv* pEnv, jobject pThis, jstring hexseed)
{
    AndroidWallet androidWallet;

    // convert jstring to string
    const jclass stringClass = pEnv->GetObjectClass(hexseed);
    const jmethodID getBytes = pEnv->GetMethodID(stringClass, "getBytes", "(Ljava/lang/String;)[B");
    const jbyteArray stringJbytes = (jbyteArray) pEnv->CallObjectMethod(hexseed, getBytes, pEnv->NewStringUTF("UTF-8"));
    size_t length = (size_t) pEnv->GetArrayLength(stringJbytes);
    jbyte* pBytes = pEnv->GetByteArrayElements(stringJbytes, NULL);
    std::string ret = std::string((char *)pBytes, length);
    pEnv->ReleaseByteArrayElements(stringJbytes, pBytes, JNI_ABORT);
    pEnv->DeleteLocalRef(stringJbytes);
    pEnv->DeleteLocalRef(stringClass);

    return pEnv-> NewStringUTF( androidWallet.getMnemonic(ret).c_str() );
}


#ifdef __cplusplus
}
#endif
